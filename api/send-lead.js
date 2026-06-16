import { processLead } from "./lib/process-lead.js";

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body) return JSON.parse(req.body);

  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Некорректный JSON"));
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const payload = await readBody(req);
    await processLead(payload);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    const status = err.code === "VALIDATION" ? 400 : err.code === "CONFIG" ? 503 : 500;
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: err.message || "Не удалось отправить заявку",
        fields: err.fields || undefined,
      })
    );
  }
}
