/* ============================================================
   TMK — core UI components (icons, header, footer, cards…)
   ============================================================ */
import { useState, useEffect, Fragment } from "react";
import TMK from "../data.js";
import { go, navSection } from "../navigation.js";

/* ---------------- Icons ---------------- */
export const Ic = {
  pin: (p) => (<svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>),
  wa: (p) => (<svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>),
  arrow: (p) => (<svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  search: (p) => (<svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>),
  check: (p) => (<svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>),
  building: (p) => (<svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M19 21V11h-3"/><path d="M9 7h2M9 11h2M9 15h2"/></svg>),
  layers: (p) => (<svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></svg>),
  key: (p) => (<svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.5 12.5 8-8M16 5l3 3M14 7l2 2"/></svg>),
  shield: (p) => (<svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>),
  briefcase: (p) => (<svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>),
  route: (p) => (<svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h6a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h0"/></svg>),
  sparkle: (p) => (<svg width={p?.s||22} height={p?.s||22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>),
  coffee: (p) => (<svg width={p?.s||15} height={p?.s||15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z"/></svg>),
};

export const WA = TMK.waLink;
export const WT = TMK.WA_TEXT;

export function PhotoSlot({ ph, src, alt }) {
  if (src) {
    return (
      <div className="photo">
        <img src={src} alt={alt || ph || ""} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }
  return (
    <div className="photo" style={{
      background: "linear-gradient(135deg,#E9EEF3 0%,#D6E2EE 55%,#C7D7E8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ color: "#6B8299", fontSize: 14, padding: 16, textAlign: "center" }}>
        {ph || "Фото объекта"}
      </span>
    </div>
  );
}

export function ClassBadge({ o, dark }) {
  return <span className={"badge " + (dark ? "badge-class" : "badge-copper")}>Класс {o.buildingClass}</span>;
}

export function StatusBadge({ status }) {
  const s = TMK.STATUS[status];
  if (!s) return null;
  return <span className={"badge badge-status " + (s.tone === "reno" ? "reno" : s.tone === "launch" ? "launch" : "")}>{s.label}</span>;
}

function Brand({ footer }) {
  return (
    <div className={footer ? "footer-brand" : "brand"} onClick={() => go("/")} style={{ cursor: "pointer" }}>
      <span className="bn">TMK</span>
      <span className="bs">Limited Properties Services</span>
    </div>
  );
}

export function Header({ overlay }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const solid = !overlay || scrolled;
  const cls = "site-header " + (solid ? "solid" : "overlay");
  const navClick = (fn) => (e) => { e.preventDefault(); setMenu(false); fn(); };
  return (
    <Fragment>
      <header className={cls}>
        <div className="container bar">
          <Brand />
          <nav className="nav">
            <a className="link" onClick={navClick(() => go("/catalog"))}>Каталог</a>
            <a className="link" onClick={navClick(() => navSection("serviced"))}>Сервисные офисы</a>
            <a className="link" onClick={navClick(() => navSection("formats"))}>Форматы</a>
            <a className="link" onClick={navClick(() => navSection("about"))}>О компании</a>
            <a className="link" onClick={navClick(() => navSection("lead"))}>Контакты</a>
          </nav>
          <div className="header-actions">
            <a className="hdr-wa" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 17 })} WhatsApp</a>
            <button className="burger" aria-label="Меню" onClick={() => setMenu(true)}><span></span></button>
          </div>
        </div>
      </header>
      <div className={"msheet " + (menu ? "open" : "")}>
        <div className="top">
          <span className="bn">TMK Limited Properties Services</span>
          <button className="x" onClick={() => setMenu(false)}>×</button>
        </div>
        <nav>
          <a onClick={navClick(() => go("/catalog"))}>Каталог офисов</a>
          <a onClick={navClick(() => navSection("serviced"))}>Сервисные офисы</a>
          <a onClick={navClick(() => navSection("formats"))}>Форматы офисов</a>
          <a onClick={navClick(() => navSection("about"))}>О компании</a>
          <a onClick={navClick(() => navSection("lead"))}>Оставить заявку</a>
        </nav>
        <div className="ma">
          <a className="btn btn-primary btn-block" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Написать в WhatsApp</a>
        </div>
      </div>
    </Fragment>
  );
}

export function Footer() {
  const C = TMK.COMPANY;
  return (
    <footer className="site-footer">
      <span className="glow"></span>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="bn">TMK</div>
            <div className="bs">Limited Properties Services</div>
            <p>Подбор офисов и коммерческой недвижимости в Алматы под задачи бизнеса — с сопровождением заявки на каждом этапе.</p>
          </div>
          <div className="fcol">
            <h5>Навигация</h5>
            <a onClick={() => go("/")}>Главная</a>
            <a onClick={() => go("/catalog")}>Каталог офисов</a>
            <a onClick={() => navSection("serviced")}>Сервисные офисы</a>
            <a onClick={() => navSection("about")}>О компании</a>
          </div>
          <div className="fcol">
            <h5>Форматы</h5>
            <a onClick={() => navSection("formats")}>Офис</a>
            <a onClick={() => navSection("formats")}>Сервисный офис</a>
            <a onClick={() => navSection("formats")}>Офис под ключ</a>
          </div>
          <div className="fcol">
            <h5>Контакты</h5>
            <a href={"tel:+" + C.waNumber} className="fitem"><b>{C.phoneDisplay}</b></a>
            <a href={"mailto:" + C.email} className="fitem">{C.email}</a>
            <a href={WA(WT.general)} target="_blank" rel="noopener" className="fitem" style={{ color: "#fff", fontWeight: 700 }}>{Ic.wa({ s: 15 })} &nbsp;Написать в WhatsApp</a>
            <span className="fitem" style={{ cursor: "default" }}>Алматы, Казахстан</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TMK Limited Properties Services</span>
          <span>Аренда офисов и коммерческой недвижимости · Алматы</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a className="wa-float" href={WA(WT.general)} target="_blank" rel="noopener" aria-label="Написать в WhatsApp">
      <span className="ic">{Ic.wa({ s: 22 })}</span>
      <span className="tx"><b>Написать в WhatsApp</b><span>Ответим в рабочее время</span></span>
    </a>
  );
}

export function ObjectCardMain({ o }) {
  return (
    <article className="obj-card">
      <div className="media">
        <div className="badges">
          <ClassBadge o={o} />
          <StatusBadge status={o.status} />
        </div>
        <PhotoSlot ph={o.title} src={o.photo} alt={o.title} />
      </div>
      <div className="body">
        <div className="loc">{Ic.pin({ s: 14 })} {o.district} район</div>
        <h3>{o.title}</h3>
        <div className="addr">{o.address}</div>
        <div className="specs">
          <div className="sp"><b>{o.gbaLabel}</b><span>общая площадь</span></div>
          <div className="sp"><b>{o.floors}</b><span>этажей</span></div>
        </div>
        <div className="actions">
          <a className="btn btn-dark btn-sm" onClick={() => go("/objects/" + o.slug)}>Подробнее</a>
          <a className="btn btn-wa btn-sm" href={WA(WT.card(o.title))} target="_blank" rel="noopener">{Ic.wa({ s: 16 })} WhatsApp</a>
        </div>
      </div>
    </article>
  );
}

export function ObjectCardCatalog({ o }) {
  return (
    <article className="obj-card">
      <div className="media">
        <div className="badges">
          <ClassBadge o={o} />
          <StatusBadge status={o.status} />
        </div>
        <PhotoSlot ph={o.title} src={o.photo} alt={o.title} />
      </div>
      <div className="body">
        <div className="loc">{Ic.pin({ s: 14 })} {o.district} район · {o.address}</div>
        <h3>{o.title}</h3>
        <p className="desc">{o.shortDescription}</p>
        <div className="specs">
          <div className="sp"><b>{o.gbaLabel}</b><span>общая</span></div>
          <div className="sp"><b>{o.gfaLabel.replace("/этаж", "")}</b><span>этаж</span></div>
          <div className="sp"><b>{o.floors}</b><span>этажей</span></div>
        </div>
        <div className="actions">
          <a className="btn btn-dark btn-sm" onClick={() => go("/objects/" + o.slug)}>Подробнее {Ic.arrow({ s: 15 })}</a>
          <a className="btn btn-wa btn-sm" href={WA(WT.card(o.title))} target="_blank" rel="noopener">{Ic.wa({ s: 16 })}</a>
        </div>
      </div>
    </article>
  );
}

export function SimilarCard({ o }) {
  return (
    <article className="sim-card" onClick={() => go("/objects/" + o.slug)}>
      <div className="media"><PhotoSlot ph={o.title} src={o.photo} alt={o.title} /></div>
      <div className="body">
        <div className="loc">{Ic.pin({ s: 13 })} {o.district} район</div>
        <h4>{o.title}</h4>
      </div>
    </article>
  );
}

const PARTNERS = [
  ["Qatar Airways", "/assets/partners/qatar-airways.png"],
  ["Coca-Cola", "/assets/partners/coca-cola.png"],
  ["Tele2", "/assets/partners/tele2.png"],
  ["Kcell", "/assets/partners/kcell.png"],
  ["Hitachi", "/assets/partners/hitachi.png"],
  ["Coventry University", "/assets/partners/coventry.png"],
  ["Yandex", "/assets/partners/yandex.png"],
  ["Freedom Holding", "/assets/partners/freedom.png"],
  ["Galanz Bottlers", "/assets/partners/galanz.png"],
];

export function PartnersStrip() {
  return (
    <div className="partners-grid">
      {PARTNERS.map(([name, src]) => (
        <div className="partner-tile" key={name}><img src={src} alt={name} loading="lazy" /></div>
      ))}
    </div>
  );
}
