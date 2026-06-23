import nodemailer from "nodemailer";

const DEFAULT_TO = "Yerlepessov.t@tmk-limited.com";

function phoneBodyDigits(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.startsWith("7") ? digits.slice(1) : digits;
}

export function validateLead(payload) {
  const errors = {};
  const name = String(payload?.name || "").trim();
  const company = String(payload?.company || "").trim();
  const digits = phoneBodyDigits(payload?.phone);

  if (!name) errors.name = "Укажите имя";
  if (!digits.length) errors.phone = "Укажите телефон";
  else if (digits.length < 10) errors.phone = "Введите 10 цифр номера";
  if (!company) errors.company = "Укажите компанию";

  if (Object.keys(errors).length) {
    const err = new Error("Проверьте поля формы");
    err.code = "VALIDATION";
    err.fields = errors;
    throw err;
  }

  return {
    name,
    phone: String(payload.phone || "").trim(),
    company,
    area: String(payload?.area || "").trim(),
    budget: String(payload?.budget || "").trim(),
    format: String(payload?.format || "").trim(),
    comment: String(payload?.comment || "").trim(),
    sourcePage: String(payload?.sourcePage || "").trim(),
    objectTitle: String(payload?.objectTitle || "").trim(),
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(lead) {
  const subjectParts = ["Заявка с сайта TMK"];
  if (lead.objectTitle) subjectParts.push(lead.objectTitle);
  else if (lead.sourcePage) subjectParts.push(lead.sourcePage);

  const rows = [
    ["Имя", lead.name],
    ["Телефон", lead.phone],
    ["Компания", lead.company],
    ["Желаемая площадь", lead.area || "—"],
    ["Бюджет", lead.budget || "—"],
    ["Формат офиса", lead.format || "—"],
    ["Комментарий", lead.comment || "—"],
    ["Страница", lead.sourcePage || "—"],
    ["Объект", lead.objectTitle || "—"],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#102a43">
      <h2 style="margin:0 0 16px">Новая заявка с сайта</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px 12px;border:1px solid #d9e2ec;vertical-align:top;width:180px"><b>${escapeHtml(k)}</b></td>
            <td style="padding:8px 12px;border:1px solid #d9e2ec;vertical-align:top">${escapeHtml(v)}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `.trim();

  return { subject: subjectParts.join(" · "), text, html };
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    const err = new Error("Почтовый сервер не настроен");
    err.code = "CONFIG";
    throw err;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return {
    host,
    port,
    secure,
    auth: { user, pass },
  };
}

export async function processLead(payload) {
  const lead = validateLead(payload);
  const { subject, text, html } = buildEmail(lead);

  const transporter = nodemailer.createTransport(getSmtpConfig());
  const from = process.env.LEAD_FROM_EMAIL || process.env.SMTP_USER;
  const to = process.env.LEAD_TO_EMAIL || DEFAULT_TO;

  await transporter.sendMail({
    from: `"TMK Website" <${from}>`,
    to,
    replyTo: from,
    subject,
    text,
    html,
  });

  return lead;
}
