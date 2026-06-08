/* Helpers + catalog entries (deduped against existing core objects) */

export const ALLOWED_SLUGS = new Set([
  "sat", "old-square", "koktem-towers", "almaty-plaza", "tole-bi", "q",
  "capital-tower", "prime", "abylai-khan-plaza", "alatau-grand", "d-43",
  "triumph", "viia-tower", "kulan", "almaty-residence", "green-tower",
  "fortis", "dial-plaza", "nova", "han-tengri", "d-160", "avrora", "rams",
  "element-tower", "globus", "star", "koktem-grand", "venus", "teniz-towers",
  "time-square", "nurly-tau",
]);

/** slug → filename in /assets/objects/ (only for newly added photos) */
const PHOTO_FILES = {
  sat: "SAT.png",
  "old-square": "Old Square.png",
  "almaty-plaza": "Almaty plaza.png",
  q: "Q.png",
  "capital-tower": "Capital tower.png",
  prime: "Prime.png",
  "abylai-khan-plaza": "Abylai khan plaza.png",
  "alatau-grand": "Alatau Grand.png",
  "d-43": "D-43.png",
  "viia-tower": "Viia tower.png",
  avrora: "Avrora.png",
  fortis: "Fortis.png",
  nova: "Nova.png",
  "han-tengri": "Khan Tengri.jpg",
  "d-160": "D-160.png",
  "element-tower": "Element tower.png",
  globus: "Globus.png",
  star: "Star.png",
  rams: "Rubenshtein 48.png",
  "tole-bi": "Tole bi.png",
  kulan: "Kulan.png",
  "almaty-residence": "Almaty Residence.png",
};

const NAME_ALIASES = {
  триумф: "triumph",
  greentower: "greentower",
  koktemtowers: "koktemtowers",
  dialplaza: "dialplaza",
};

export function normNameKey(name) {
  const key = name
    .replace(/^БЦ\s+/i, "")
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, "");
  return NAME_ALIASES[key] || key;
}

function photoUrl(filename) {
  return `/assets/objects/${encodeURIComponent(filename)}`;
}

export function attachPhoto(obj) {
  if (obj.photo) return obj;
  const file = PHOTO_FILES[obj.slug];
  return file ? { ...obj, photo: photoUrl(file) } : obj;
}

function formatGba(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " м²";
}

function estimateFloors(gba) {
  if (gba == null) return 8;
  if (gba > 50000) return 20;
  if (gba > 20000) return 14;
  if (gba > 10000) return 10;
  if (gba > 5000) return 8;
  return 6;
}

function estimateParking(gba) {
  if (gba == null) return "Наземный паркинг";
  if (gba > 50000) return "Более 300 мест";
  if (gba > 20000) return "120 мест";
  if (gba > 10000) return "80 мест";
  if (gba > 5000) return "50 мест";
  return "30 мест";
}

function coordsForSlug(slug, bounds) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  const lat = bounds.latMin + (Math.abs(h) % 1000) / 1000 * (bounds.latMax - bounds.latMin);
  const lng = bounds.lngMin + (Math.abs(h >> 10) % 1000) / 1000 * (bounds.lngMax - bounds.lngMin);
  return { lat: +lat.toFixed(3), lng: +lng.toFixed(3) };
}

function makeTitle(name, slug) {
  if (slug === "rams") return name;
  return name.startsWith("БЦ ") ? name : `БЦ ${name}`;
}

function makeObject(id, row, bounds, statusMap) {
  const { name, district, buildingClass, gba, address, slug, status: statusKey = "active" } = row;
  const classKeys = buildingClass === "A" ? ["A"] : buildingClass === "B+" ? ["B+"] : ["B"];
  const floors = estimateFloors(gba);
  const title = makeTitle(name, slug);
  const gbaLabel = gba != null ? formatGba(gba) : null;
  const gfaPerFloor = gba != null ? Math.max(200, Math.round(gba / floors)) : null;
  const gfaLabel = gfaPerFloor != null
    ? gfaPerFloor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " м²/этаж"
    : null;
  const parking = estimateParking(gba);
  const statusInfo = statusMap[statusKey] || statusMap.active;

  const characteristics = {};
  const areaRows = [];
  if (gbaLabel) {
    areaRows.push(["Общая площадь (GBA)", gbaLabel]);
    if (gfaLabel) areaRows.push(["Площадь этажа (GFA)", gfaLabel.replace("/этаж", "")]);
  }
  if (areaRows.length) characteristics["Площади"] = areaRows;

  characteristics["Здание"] = [
    ["Класс", buildingClass],
    ["Этажность", floors + " этажей"],
    ["Планировка", "Open space · Кабинеты"],
    ["Лифты", "В наличии"],
    ["Статус", statusInfo.label],
  ];
  characteristics["Инженерия"] = [
    ["Вентиляция", "Приточно-вытяжная"],
    ["Кондиционирование", "Центральное"],
  ];
  characteristics["Комфорт и доступ"] = [
    ["Паркинг", parking],
    ["Охрана", "24/7"],
    ["Доступ в здание", "24/7"],
  ];

  const areaPart = gbaLabel ? ` — общая площадь ${gbaLabel}` : "";
  const shortDescription =
    `Бизнес-центр класса ${buildingClass} в ${district} районе по адресу ${address}${areaPart}. ` +
    "Open space и кабинеты, центральная инженерия и инфраструктура для офисной аренды.";

  const file = PHOTO_FILES[slug];

  return {
    id,
    slug,
    title,
    district,
    address,
    buildingClass,
    classKeys,
    classNote: "",
    gba: gba ?? null,
    gbaLabel,
    gfaLabel,
    floors,
    parking,
    status: statusKey,
    photo: file ? photoUrl(file) : undefined,
    coords: coordsForSlug(slug, bounds),
    shortDescription,
    similar: [],
    planning: "Open space · Кабинеты",
    characteristics,
    infrastructure: ["Магазины", "Кафе", "Аптеки"],
  };
}

const NEW_OFFICES_RAW = [
  { name: "SAT", district: "Бостандыкский", buildingClass: "B", gba: 14500, address: "Улица Манаса, 32а", slug: "sat" },
  { name: "Old Square", district: "Алмалинский", buildingClass: "B", gba: 22000, address: "Панфилова 98", slug: "old-square" },
  { name: "Almaty Plaza", district: "Ауэзовский", buildingClass: "A", gba: 23000, address: "Наурызбай батыра 17А", slug: "almaty-plaza" },
  { name: "Толе-Би", district: "Алмалинский", buildingClass: "B", gba: 22000, address: "Толе би, 101", slug: "tole-bi" },
  { name: "Q", district: "Бостандыкский", buildingClass: "A", gba: 16762, address: "Кабанбай батыр проспект, 15а", slug: "q" },
  { name: "Capital Tower", district: "Бостандыкский", buildingClass: "A", gba: 22000, address: "Абиша Кекильбайулы ул., 34", slug: "capital-tower" },
  { name: "Prime", district: "Медеуский", buildingClass: "B+", gba: 8686, address: "проспект Назарбаева, 100г", slug: "prime" },
  { name: "Abylai Khan Plaza", district: "Алмалинский", buildingClass: "B+", gba: 13866, address: "Абылай хана 53", slug: "abylai-khan-plaza" },
  { name: "Алатау Гранд", district: "Бостандыкский", buildingClass: "B", gba: 28000, address: "Тимирязева 28", slug: "alatau-grand" },
  { name: "D-43", district: "Медеуский", buildingClass: "B", gba: 6552, address: "Достык 43", slug: "d-43" },
  { name: "Viia Tower", district: "Алмалинский", buildingClass: "B", gba: 4626, address: "Жумалиева 86", slug: "viia-tower" },
  { name: "Kulan", district: "Медеуский", buildingClass: "B", gba: 5500, address: "Достык 188", slug: "kulan", status: "reno" },
  { name: "Almaty Residence", district: "Алмалинский", buildingClass: "B", gba: 15000, address: "Ауэзова ул., 60", slug: "almaty-residence" },
  { name: "Fortis", district: "Бостандыкский", buildingClass: "B", gba: 11000, address: "Ходжанова 2/2", slug: "fortis" },
  { name: "Nova", district: "Ауэзовский", buildingClass: "B", gba: 2500, address: "Жандосова 136", slug: "nova" },
  { name: "Хан-Тенгри", district: "Медеуский", buildingClass: "B", gba: 15000, address: "Кажымукана 22/5", slug: "han-tengri" },
  { name: "D-160", district: "Медеуский", buildingClass: "B", gba: 6500, address: "Достык 160", slug: "d-160" },
  { name: "Аврора", district: "Бостандыкский", buildingClass: "B", gba: 7500, address: "Ходжанова 79", slug: "avrora" },
  { name: "Рубенштейна 48", district: "Алмалинский", buildingClass: "B", gba: null, address: "Рубинштейна 48", slug: "rams" },
  { name: "Element Tower", district: "Ауэзовский", buildingClass: "A", gba: 7800, address: "Политехническая 8", slug: "element-tower" },
  { name: "Globus", district: "Алмалинский", buildingClass: "B", gba: 15000, address: "Абая 109 В", slug: "globus" },
  { name: "Star", district: "Бостандыкский", buildingClass: "B", gba: 9000, address: "Назарбаева 187Б", slug: "star" },
];

export function buildExtraObjects(existingObjects, bounds, statusMap) {
  const existingKeys = new Set(existingObjects.map((o) => normNameKey(o.title)));
  const seen = new Set(existingKeys);
  const extras = [];

  for (const row of NEW_OFFICES_RAW) {
    if (!ALLOWED_SLUGS.has(row.slug)) continue;
    const key = normNameKey(row.name);
    if (seen.has(key)) continue;
    seen.add(key);
    extras.push(row);
  }

  const startId = existingObjects.length + 1;
  return extras.map((row, i) => makeObject(startId + i, row, bounds, statusMap));
}

export function finalizeCatalog(objects) {
  return objects
    .filter((o) => ALLOWED_SLUGS.has(o.slug))
    .map(attachPhoto)
    .map((o, i) => ({ ...o, id: i + 1 }));
}
