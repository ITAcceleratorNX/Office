/* ============================================================
   TMK — Map placeholder (2GIS stub) + Lead form
   ============================================================ */
import { useState, useEffect } from "react";
import TMK from "../data.js";
import { go, openObject } from "../navigation.js";
import { useCurrentPath } from "../hooks/useCurrentPath.js";
import { Ic, PhotoSlot } from "./ui-core.jsx";

const MB = TMK.MAP_BOUNDS;

function coordToXY(c) {
  let x = (c.lng - MB.lngMin) / (MB.lngMax - MB.lngMin);
  let y = (MB.latMax - c.lat) / (MB.latMax - MB.latMin);
  x = 8 + Math.max(0, Math.min(1, x)) * 84;
  y = 10 + Math.max(0, Math.min(1, y)) * 78;
  return { x, y };
}

function MapStreets() {
  return (
    <svg className="canvas" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="mapg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10324F" />
          <stop offset="0.55" stopColor="#0E2E4D" />
          <stop offset="1" stopColor="#0A2440" />
        </linearGradient>
        <radialGradient id="mapglow" cx="0.7" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#17506E" stopOpacity="0.5" />
          <stop offset="1" stopColor="#17506E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="460" fill="url(#mapg)" />
      <rect width="800" height="460" fill="url(#mapglow)" />
      <g fill="#ffffff" opacity="0.025">
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 12 }).map((_, c) => (
            <rect key={r + "-" + c} x={20 + c * 64 + ((r % 2) * 12)} y={18 + r * 62} width="46" height="44" rx="4" />
          ))
        )}
      </g>
      <g stroke="#5E7E96" strokeOpacity="0.22" strokeWidth="2" fill="none">
        <path d="M-20 90 L820 70" /><path d="M-20 210 L820 188" />
        <path d="M-20 330 L820 312" /><path d="M120 -20 L150 480" />
        <path d="M330 -20 L360 480" /><path d="M560 -20 L590 480" />
      </g>
      <path d="M250 -20 L300 480" stroke="#7FA6BE" strokeOpacity="0.3" strokeWidth="4" fill="none" />
      <path d="M-20 400 C 200 360, 360 430, 820 360" stroke="#2E6E8E" strokeOpacity="0.4" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function MapPin({ o, active, onClick }) {
  const { x, y } = o.__single ? { x: 50, y: 50 } : coordToXY(o.coords);
  return (
    <div className={"map-pin " + (active ? "active" : "")} style={{ left: x + "%", top: y + "%" }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(o); }}>
      <span className="lbl">{o.title}</span>
      <svg className="dot" viewBox="0 0 30 30" fill="none">
        <path d="M15 2C9.5 2 5 6.4 5 11.9c0 6.6 8.3 14.4 9.3 15.3.4.4 1 .4 1.4 0C16.7 26.3 25 18.5 25 11.9 25 6.4 20.5 2 15 2Z"
          fill={active ? "#B73F0D" : "#0E2E4D"} stroke="#fff" strokeWidth="1.6" />
        <circle cx="15" cy="11.8" r="3.6" fill="#fff" />
      </svg>
    </div>
  );
}

function MapPopup({ o, onClose, from }) {
  const { x, y } = coordToXY(o.coords);
  return (
    <div className="map-popup" style={{ left: x + "%", top: y + "%" }} onClick={(e) => e.stopPropagation()}>
      <button className="x" onClick={onClose}>×</button>
      <div className="media"><PhotoSlot ph={o.title} src={o.photo} alt={o.title} /></div>
      <div className="body">
        <div className="loc">{o.district} район</div>
        <h4>{o.title}</h4>
        <div className="addr">{o.address}</div>
        <a className="btn btn-dark btn-sm" onClick={() => openObject(o.slug, from)}>Подробнее {Ic.arrow({ s: 14 })}</a>
      </div>
      <span className="arrow"></span>
    </div>
  );
}

export function MapPlaceholder({ objects, height = 480, single = false }) {
  const [active, setActive] = useState(null);
  const from = useCurrentPath();
  const list = single ? objects.map((o) => ({ ...o, __single: true })) : objects;
  return (
    <div className="map-ph" style={{ height }} onClick={() => setActive(null)}>
      <MapStreets />
      <div className="badge2gis">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#114A65" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
        Карта 2GIS
      </div>
      <div className="note">Демо-карта · 2GIS подключим по API-ключу</div>
      {list.map((o) => (
        <MapPin key={o.slug} o={o} active={active && active.slug === o.slug}
          onClick={single ? null : (obj) => setActive(obj)} />
      ))}
      {active && !single && <MapPopup o={active} onClose={() => setActive(null)} from={from} />}
    </div>
  );
}

const FORMATS = TMK.officeFormats;

function formatPhoneInput(raw) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "+7";
  let out = "+7";
  if (digits.length > 0) out += " " + digits.slice(0, 3);
  if (digits.length > 3) out += " " + digits.slice(3, 6);
  if (digits.length > 6) out += " " + digits.slice(6, 8);
  if (digits.length > 8) out += " " + digits.slice(8, 10);
  return out;
}

function phoneBodyDigits(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("7") ? digits.slice(1) : digits;
}

export function LeadForm({ sourcePage, objectTitle, compact, defaultFormat = "" }) {
  const [v, setV] = useState({
    name: "",
    phone: "+7",
    company: "",
    area: "",
    budget: "",
    format: defaultFormat,
    comment: "",
  });
  const [err, setErr] = useState({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    if (defaultFormat) setV((s) => ({ ...s, format: defaultFormat }));
  }, [defaultFormat]);

  function onPhoneChange(e) {
    setV((s) => ({ ...s, phone: formatPhoneInput(e.target.value) }));
  }

  function onPhoneKeyDown(e) {
    if (e.key !== "Backspace") return;
    if (phoneBodyDigits(v.phone).length === 0) e.preventDefault();
  }

  function validate() {
    const e = {};
    if (!v.name.trim()) e.name = "Укажите имя";
    const digits = phoneBodyDigits(v.phone);
    if (!digits.length) e.phone = "Укажите телефон";
    else if (digits.length < 10) e.phone = "Введите 10 цифр номера";
    if (!v.company.trim()) e.company = "Укажите компанию";
    setErr(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSending(true);
    try {
      const res = await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, sourcePage, objectTitle }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErr((prev) => ({ ...prev, ...data.fields }));
        throw new Error(data.error || "Не удалось отправить заявку");
      }
      try {
        sessionStorage.setItem("tmk_lead", JSON.stringify({ ...v, sourcePage, objectTitle, ts: Date.now() }));
      } catch (e) { /* ignore */ }
      go("/thank-you");
    } catch (e) {
      setSubmitError(e.message || "Не удалось отправить заявку. Попробуйте позже или напишите в WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="lead-wrap" onSubmit={submit} noValidate>
      {objectTitle && (
        <div className="lead-object-chip">{Ic.building({ s: 16 })} Заявка по объекту: {objectTitle}</div>
      )}
      <div className="lead-grid">
        <div className="field">
          <label>Имя <span className="req">*</span></label>
          <input className={"control" + (err.name ? " invalid" : "")} value={v.name} onChange={set("name")} placeholder="Как к вам обращаться" />
          {err.name && <span className="err-msg">{err.name}</span>}
        </div>
        <div className="field">
          <label>Телефон <span className="req">*</span></label>
          <input
            className={"control" + (err.phone ? " invalid" : "")}
            value={v.phone}
            onChange={onPhoneChange}
            onKeyDown={onPhoneKeyDown}
            onFocus={() => { if (!v.phone) setV((s) => ({ ...s, phone: "+7" })); }}
            placeholder="+7 ___ ___ __ __"
            inputMode="tel"
            autoComplete="tel"
          />
          {err.phone && <span className="err-msg">{err.phone}</span>}
        </div>
        <div className="field">
          <label>Компания <span className="req">*</span></label>
          <input className={"control" + (err.company ? " invalid" : "")} value={v.company} onChange={set("company")} placeholder="Название компании" />
          {err.company && <span className="err-msg">{err.company}</span>}
        </div>
        <div className="field">
          <label>Желаемая площадь</label>
          <input className="control" value={v.area} onChange={set("area")} placeholder="Например, 200–400 м²" />
        </div>
        <div className="field">
          <label>Бюджет</label>
          <input className="control" value={v.budget} onChange={set("budget")} placeholder="Например, до 500 000 тг/мес" />
        </div>
        <div className="field full">
          <label>Формат офиса</label>
          <select className="control" value={v.format} onChange={set("format")}>
            <option value="">Выберите формат</option>
            {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="field full">
          <label>Комментарий</label>
          <textarea className="control" value={v.comment} onChange={set("comment")} placeholder="Дополнительные пожелания (необязательно)"></textarea>
        </div>
      </div>
      <div className="lead-submit-row">
        <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
          {sending ? "Отправляем…" : <>Оставить заявку {Ic.arrow({ s: 16 })}</>}
        </button>
        {!compact && <span className="lead-note">Нажимая кнопку, вы соглашаетесь на обработку данных. На карточках указана ориентировочная ставка — точные условия уточняет менеджер.</span>}
      </div>
      {submitError && <p className="lead-form-error">{submitError}</p>}
    </form>
  );
}
