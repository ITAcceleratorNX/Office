/**
 * Geocoder: fills coords in src/data.js via Nominatim (structured query).
 * Usage: node scripts/geocode.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "../src/data.js");
const DELAY_MS = 1100;
const USER_AGENT = "TMK-Properties-Geocoder/1.0 (Yerlepessov.t@tmk-limited.com)";
const VIEWBOX = "76.75,43.40,77.10,43.15"; // left,top,right,bottom

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function inAlmaty(lat, lng) {
  return lat >= 43.1 && lat <= 43.4 && lng >= 76.7 && lng <= 77.1;
}

/** Split "Улица 53" / "Достык 310/1" → { road, house, street } */
function parseAddress(address) {
  const m = address.trim().match(/^(.+?)\s+(\d[\d/A-Za-zА-Яа-яЁё.-]*)$/u);
  if (m) {
    const road = m[1].trim();
    const house = m[2].trim();
    return { road, house, street: `${house} ${road}` };
  }
  return { road: address.trim(), house: "", street: address.trim() };
}

function normRoad(s) {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\b(ул\.?|улица|пр\.?|проспект|avenue|street|бульвар|бул\.?|шоссе)\b/gi, "")
    .replace(/[—–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function roadsMatch(expectedRoad, foundRoad) {
  const a = normRoad(expectedRoad);
  const b = normRoad(foundRoad);
  if (!b) return false;
  if (!a) return true;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const wordsA = a.split(" ").filter((w) => w.length > 2);
  const wordsB = b.split(" ").filter((w) => w.length > 2);
  return wordsA.some((w) => wordsB.some((v) => v.includes(w) || w.includes(v)));
}

async function geocode(address) {
  const { road, house, street } = parseAddress(address);
  const params = new URLSearchParams({
    street,
    city: "Алматы",
    country: "Казахстан",
    format: "json",
    limit: "1",
    "accept-language": "ru",
    addressdetails: "1",
    viewbox: VIEWBOX,
    bounded: "1",
  });

  const url = `https://nominatim.openstreetmap.org/search?${params}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.length) return { status: "not_found", expectedRoad: road, expectedHouse: house };

  const hit = data[0];
  const lat = parseFloat(hit.lat);
  const lng = parseFloat(hit.lon);
  const addr = hit.address || {};
  const foundRoad = addr.road || addr.pedestrian || addr.footway || addr.neighbourhood || "";
  const foundHouse = addr.house_number || "";

  if (!inAlmaty(lat, lng)) {
    return {
      status: "out_of_bounds",
      lat,
      lng,
      foundRoad,
      foundHouse,
      expectedRoad: road,
      expectedHouse: house,
      displayName: hit.display_name,
    };
  }

  const suspicious = !roadsMatch(road, foundRoad);

  return {
    status: "ok",
    lat: +lat.toFixed(6),
    lng: +lng.toFixed(6),
    foundRoad,
    foundHouse,
    expectedRoad: road,
    expectedHouse: house,
    suspicious,
    displayName: hit.display_name,
  };
}

function extractObjects(content) {
  const rawStart = content.indexOf("const RAW_OBJECTS = [");
  if (rawStart === -1) throw new Error("RAW_OBJECTS not found in data.js");
  const rawEnd = content.indexOf("\n];", rawStart);
  const rawBlock = content.slice(rawStart, rawEnd);

  const objects = [];
  const re = /slug:\s*"([^"]+)"[^}]*?title:\s*"([^"]+)"[^}]*?address:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(rawBlock)) !== null) {
    objects.push({ slug: m[1], title: m[2], address: m[3] });
  }
  return objects;
}

function setCoords(content, slug, coordsValue) {
  const slugPat = `slug: "${slug}"`;
  const idx = content.indexOf(slugPat);
  if (idx === -1) throw new Error(`Slug not found: ${slug}`);

  const afterSlug = content.slice(idx);
  const addrMatch = afterSlug.match(/address:\s*"([^"]+)"/);
  if (!addrMatch) throw new Error(`Address not found for ${slug}`);

  const addrEnd = idx + addrMatch.index + addrMatch[0].length;
  const afterAddr = content.slice(addrEnd);
  const coordsRe = /^,\s*coords:\s*(\{[^}]+\}|null)/;
  const coordsStr =
    coordsValue === null
      ? ", coords: null"
      : `, coords: { lat: ${coordsValue.lat}, lng: ${coordsValue.lng} }`;

  if (coordsRe.test(afterAddr)) {
    return content.slice(0, addrEnd) + coordsStr + afterAddr.replace(coordsRe, "");
  }
  return content.slice(0, addrEnd) + coordsStr + content.slice(addrEnd);
}

function formatFound(road, house) {
  if (road && house) return `${road} ${house}`;
  if (road) return road;
  return "—";
}

async function main() {
  let content = fs.readFileSync(DATA_PATH, "utf8");
  const objects = extractObjects(content);
  const failed = [];
  const warnings = [];
  const results = [];

  console.log(`Geocoding ${objects.length} objects (structured + bounded viewbox)…\n`);

  for (let i = 0; i < objects.length; i++) {
    const { slug, title, address } = objects[i];
    if (i > 0) await sleep(DELAY_MS);

    try {
      const result = await geocode(address);

      if (result.status === "not_found") {
        content = setCoords(content, slug, null);
        const line = `${title} → NOT FOUND (ожид.: ${address}) → coords: null`;
        console.log(line);
        results.push({ slug, title, line, status: "failed" });
        failed.push({ slug, title, address, reason: "not found" });
        continue;
      }

      if (result.status === "out_of_bounds") {
        content = setCoords(content, slug, null);
        const found = formatFound(result.foundRoad, result.foundHouse);
        const line =
          `${title} → ${found} → coords: null (OUT OF BOUNDS: ${result.lat}, ${result.lng})`;
        console.log(line);
        results.push({ slug, title, line, status: "failed" });
        failed.push({
          slug,
          title,
          address,
          reason: "out of bounds",
          found,
          lat: result.lat,
          lng: result.lng,
        });
        continue;
      }

      content = setCoords(content, slug, { lat: result.lat, lng: result.lng });
      const found = formatFound(result.foundRoad, result.foundHouse);
      const line = `${title} → ${found} → ${result.lat}, ${result.lng}`;
      console.log(line);
      results.push({ slug, title, line, status: "ok", suspicious: result.suspicious });

      if (result.suspicious) {
        const warnMsg =
          `улица не совпадает — ожид. «${result.expectedRoad}», найдено «${result.foundRoad || "—"}»`;
        console.log(`   WARNING: ${warnMsg}`);
        warnings.push({
          slug,
          title,
          address,
          expectedRoad: result.expectedRoad,
          foundRoad: result.foundRoad || "—",
          foundHouse: result.foundHouse || "—",
          coords: { lat: result.lat, lng: result.lng },
        });
      }
    } catch (err) {
      content = setCoords(content, slug, null);
      const line = `${title} → ERROR: ${err.message} → coords: null`;
      console.log(line);
      results.push({ slug, title, line, status: "failed" });
      failed.push({ slug, title, address, reason: err.message });
    }
  }

  fs.writeFileSync(DATA_PATH, content, "utf8");
  console.log(`\nWrote ${DATA_PATH}`);

  console.log("\n── Итог ──");
  for (const r of results) {
    console.log(r.line);
  }

  if (warnings.length) {
    console.log("\n── Подозрительные (улица не совпадает) ──");
    for (const w of warnings) {
      console.log(
        `- ${w.slug} (${w.title}): ожид. «${w.expectedRoad}» → найдено «${[w.foundRoad, w.foundHouse].filter(Boolean).join(" ") || "—"}» → ${w.coords.lat}, ${w.coords.lng}`
      );
    }
  } else {
    console.log("\nПодозрительных объектов нет.");
  }

  if (failed.length) {
    console.log("\n── Требуют ручной правки ──");
    for (const f of failed) console.log(`- ${f.slug} (${f.title}): ${f.reason}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
