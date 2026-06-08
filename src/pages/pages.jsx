/* ============================================================
   TMK — Pages: Home, Catalog, ObjectPage, ThankYou
   ============================================================ */
import { useState, useEffect, useMemo, Fragment } from "react";
import TMK from "../data.js";
import { go, navSection } from "../navigation.js";
import {
  Ic, WA, WT,
  PhotoSlot, ClassBadge, StatusBadge,
  ObjectCardMain, ObjectCardCatalog, SimilarCard, PartnersStrip,
} from "../components/ui-core.jsx";
import { MapPlaceholder, LeadForm } from "../components/ui-form-map.jsx";
import { MapLeaflet } from "../components/MapLeaflet.jsx";

const T = TMK;

/* ---------- Section header ---------- */
function SectionHead({ eyebrow, title, text, dark, center, max }) {
  return (
    <div className={"section-head" + (center ? " mx-auto center" : "")} style={center ? { marginInline: "auto" } : null}>
      {eyebrow && <span className={"eyebrow" + (dark ? " on-dark" : "")}>{eyebrow}</span>}
      <h2 style={dark ? { color: "#fff" } : null}>{title}</h2>
      {text && <p style={dark ? { color: "rgba(255,255,255,0.74)" } : null}>{text}</p>}
    </div>
  );
}

/* ======================= HOME ======================= */
function Home() {
  const featured = ["green-tower", "dial-plaza", "nurly-tau", "venus", "koktem-grand", "teniz-towers"].map(T.bySlug);
  const formats = [
    { ic: Ic.briefcase, t: "Офис", d: "Классический офис в бизнес-центре под аренду: выбираете площадь и этаж под структуру команды." },
    { ic: Ic.sparkle, t: "Сервисный офис", d: "Готовое рабочее пространство с мебелью, инфраструктурой и обслуживанием — можно заехать быстрее." },
    { ic: Ic.key, t: "Офис под ключ", d: "Решение под задачи бизнеса: подбор, планировка и подготовка пространства к заезду." },
  ];
  const why = [
    ["Коммерческая недвижимость", "Работаем с офисами и коммерческими объектами разных классов и форматов в Алматы."],
    ["Подбор под задачи бизнеса", "Помогаем выбрать площадь, локацию и формат, исходя из структуры и планов вашей компании."],
    ["Сопровождение заявки", "Ведём вас от первого обращения до согласования условий аренды с собственником."],
    ["Разные форматы решений", "Офис, сервисный офис или решение под ключ — подбираем подходящий вариант."],
  ];
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <span className="glow"></span><span className="glow2"></span>
        <div className="container hero-inner">
          <div className="hero-grid">
            <div>
              <span className="eyebrow on-dark">Коммерческая недвижимость · Алматы</span>
              <h1 style={{ marginTop: 20 }}>Офисы для бизнеса в Алматы</h1>
              <p className="sub">Подберём офис, сервисное пространство или решение под ключ под задачи вашей компании — с сопровождением заявки на каждом этапе.</p>
              <div className="cta">
                <a className="btn btn-primary btn-lg" onClick={() => go("/catalog")}>Смотреть офисы {Ic.arrow({ s: 16 })}</a>
                <a className="btn btn-ghost-light btn-lg" onClick={() => navSection("lead")}>Оставить заявку</a>
              </div>
              <div className="stat-row">
                <div className="s"><b>350 000+</b><span>м² в управлении</span></div>
                <div className="stat-divider"></div>
                <div className="s"><b>10</b><span>офисных объектов</span></div>
                <div className="stat-divider"></div>
                <div className="s"><b>A–B</b><span>классы зданий</span></div>
              </div>
            </div>
            <div className="hero-card">
              <span className="chip">Класс A · BREEAM</span>
              <PhotoSlot ph="Green Tower — обложка" src={T.bySlug("green-tower").photo} alt="БЦ Green Tower" />
              <div className="tagline"><b>БЦ Green Tower</b><span>Медеуский район · Достык 192/2 · от 900 м²/этаж</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATALOG */}
      <section className="section" id="catalog-quick">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 18, marginBottom: 40 }}>
            <div className="section-head" style={{ margin: 0 }}>
              <span className="eyebrow">Каталог объектов</span>
              <h2 style={{ marginTop: 16 }}>Офисные объекты в аренду</h2>
              <p style={{ marginTop: 14 }}>Подборка бизнес-центров Алматы. Полный список — в каталоге с фильтрами.</p>
            </div>
            <a className="btn btn-light" onClick={() => go("/catalog")}>Весь каталог {Ic.arrow({ s: 15 })}</a>
          </div>
          <div className="cards-grid">
            {featured.map((o) => <ObjectCardMain key={o.slug} o={o} />)}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="section-tight">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 28 }}>
            <span className="eyebrow">{Ic.pin({ s: 14 })} На карте</span>
            <h2 style={{ marginTop: 16 }}>Все объекты на карте Алматы</h2>
          </div>
          <MapLeaflet objects={T.objects} height={520} />
        </div>
      </section>

      {/* SERVICED OFFICES (dark) */}
      <section className="dark-band section" id="serviced">
        <span className="glow"></span>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="form-split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark">Формат</span>
              <h2 style={{ color: "#fff", marginTop: 16, fontSize: "clamp(28px,3.4vw,40px)" }}>Что такое сервисный офис</h2>
              <p style={{ color: "rgba(255,255,255,0.76)", marginTop: 18, fontSize: 18 }}>
                Сервисный офис — это готовое рабочее пространство с мебелью, инфраструктурой и обслуживанием. В него можно заехать быстрее, чем оборудовать офис с нуля: меблировка, интернет, охрана и управление зданием уже на месте.
              </p>
              <div className="cta" style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a className="btn btn-primary" onClick={() => navSection("lead")}>Подобрать сервисный офис</a>
                <a className="btn btn-ghost-light" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 17 })} Спросить в WhatsApp</a>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[["Меблировка", "Готовые рабочие места"], ["Инфраструктура", "Интернет, переговорные"], ["Обслуживание", "Клининг и управление"], ["Быстрый заезд", "Минимум подготовки"]].map(([t, d]) => (
                <div key={t} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "var(--r-md)", padding: "22px" }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{t}</div>
                  <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, marginTop: 6 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section className="section" id="formats">
        <div className="container">
          <SectionHead eyebrow="Форматы офисных решений" title="Под разные задачи бизнеса" text="Эти форматы помогают точнее описать запрос в заявке — выбор формата не ограничивает каталог." />
          <div className="feature-grid">
            {formats.map((f, i) => (
              <div className={"feature" + (i === 1 ? " accent" : "")} key={f.t}>
                <div className="ico">{f.ic({ s: 24 })}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section band-tint">
        <div className="container">
          <SectionHead eyebrow="Почему выбирают нас" title="Надёжный партнёр по аренде офисов" />
          <div className="why-grid">
            {why.map(([t, d], i) => (
              <div className="why-item" key={t}>
                <div className="n">{i + 1}</div>
                <div><h4>{t}</h4><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Партнёры" title="Компании, с которыми работала команда" text="Партнёры и компании, с которыми работала команда. Кейсы не приводим — только опыт сотрудничества." />
          <PartnersStrip />
        </div>
      </section>

      {/* ABOUT */}
      <section className="section dark-band" id="about">
        <span className="glow"></span>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="form-split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark">О компании</span>
              <h2 style={{ color: "#fff", marginTop: 16, fontSize: "clamp(28px,3.4vw,40px)" }}>Опыт в коммерческой недвижимости</h2>
              <p style={{ color: "rgba(255,255,255,0.78)", marginTop: 18, fontSize: 18 }}>
                Команда работает с коммерческой недвижимостью Алматы: офисы, склады, street retail, земельные участки и другие направления. Мы помогаем бизнесу находить подходящие площади и сопровождаем сделку до заезда.
              </p>
              <div className="hero" style={{ background: "transparent", padding: 0, marginTop: 30 }}>
                <div className="stat-row" style={{ marginTop: 0 }}>
                  <div className="s"><b style={{ color: "#fff", fontSize: 34 }}>350 000+</b><span>м² в управлении</span></div>
                  <div className="stat-divider"></div>
                  <div className="s"><b style={{ color: "#fff", fontSize: 34 }}>Алматы</b><span>география работы</span></div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[[Ic.briefcase, "Офисы"], [Ic.layers, "Склады"], [Ic.building, "Street retail"], [Ic.route, "Земельные участки"]].map(([ic, t]) => (
                <div key={t} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "var(--r-md)", padding: "26px 22px" }}>
                  <div style={{ color: "#E8B79E", marginBottom: 12 }}>{ic({ s: 26 })}</div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section className="section" id="lead">
        <div className="container">
          <div className="form-split">
            <div>
              <span className="eyebrow">Заявка</span>
              <h2 style={{ marginTop: 16, fontSize: "clamp(28px,3.4vw,42px)" }}>Подберём офис под ваши задачи</h2>
              <p style={{ marginTop: 18, fontSize: 18 }}>Оставьте заявку — уточним доступные площади и условия и подберём подходящие варианты. Или напишите нам в WhatsApp.</p>
              <a className="btn btn-wa btn-lg" style={{ marginTop: 24 }} href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Написать в WhatsApp</a>
            </div>
            <LeadForm sourcePage="Главная" />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======================= CATALOG ======================= */
const CATALOG_PAGE_SIZE = 9;

function CatalogPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="catalog-pagination" aria-label="Страницы каталога">
      <button type="button" className="page-btn page-arrow" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Предыдущая страница">←</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" className={"page-btn" + (n === page ? " active" : "")} onClick={() => onChange(n)} aria-current={n === page ? "page" : undefined}>{n}</button>
      ))}
      <button type="button" className="page-btn page-arrow" disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Следующая страница">→</button>
    </nav>
  );
}

function Catalog() {
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("");
  const [cls, setCls] = useState("");
  const [area, setArea] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return T.objects.filter((o) => {
      if (q && !o.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (district && o.district !== district) return false;
      if (cls && !o.classKeys.includes(cls)) return false;
      if (area) {
        const r = T.areaRanges.find((x) => x.id === area);
        if (r && (o.gba == null || !r.test(o.gba))) return false;
      }
      return true;
    });
  }, [q, district, cls, area]);

  useEffect(() => { setPage(1); }, [q, district, cls, area]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CATALOG_PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * CATALOG_PAGE_SIZE;
    return filtered.slice(start, start + CATALOG_PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function changePage(next) {
    if (next < 1 || next > totalPages || next === page) return;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const active = q || district || cls || area;
  const reset = () => { setQ(""); setDistrict(""); setCls(""); setArea(""); };

  return (
    <main style={{ paddingTop: 74 }}>
      <section className="dark-band" style={{ paddingBlock: "44px 0" }}>
        <span className="glow"></span>
        <div className="container" style={{ position: "relative", zIndex: 2, paddingBottom: 40 }}>
          <div className="crumbs"><a onClick={() => go("/")}>Главная</a> / <span>Каталог</span></div>
          <h1 style={{ color: "#fff", fontSize: "clamp(30px,4vw,46px)", marginTop: 16 }}>Каталог офисных объектов</h1>
          <p style={{ color: "rgba(255,255,255,0.74)", marginTop: 14, fontSize: 18, maxWidth: 620 }}>
            Бизнес-центры Алматы для аренды. Используйте фильтры по названию, району, классу и площади.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          {/* FILTERS */}
          <div className="filters" style={{ marginTop: -68, position: "relative", zIndex: 5 }}>
            <div className="row">
              <div className="ffield span2">
                <label>Название бизнес-центра</label>
                <div className="search-wrap">{Ic.search({ s: 18 })}<input className="control" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по названию БЦ" /></div>
              </div>
              <div className="ffield">
                <label>Район</label>
                <select className="control" value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="">Все районы</option>
                  {T.districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="ffield">
                <label>Класс</label>
                <select className="control" value={cls} onChange={(e) => setCls(e.target.value)}>
                  <option value="">Любой класс</option>
                  {T.classes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="ffield">
                <label>Площадь</label>
                <select className="control" value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="">Любая площадь</option>
                  {T.areaRanges.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="filters-meta">
              <div className="count">Найдено: <b>{filtered.length}</b> из {T.objects.length}{active ? "" : " объектов"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                {active && <button className="reset-btn" onClick={reset}>✕ Сбросить фильтры</button>}
                <button className="btn btn-light btn-sm toggle-map" onClick={() => setShowMap((s) => !s)}>
                  {Ic.pin({ s: 15 })} {showMap ? "Скрыть карту" : "Показать на карте"}
                </button>
              </div>
            </div>
          </div>

          <CatalogPagination page={page} totalPages={totalPages} onChange={changePage} />

          {/* GRID */}
          <div style={{ marginTop: 32 }}>
            {filtered.length > 0 ? (
              <div className="cards-grid catalog">
                {paged.map((o) => <ObjectCardCatalog key={o.slug} o={o} />)}
              </div>
            ) : (
              <div className="empty-state">
                <h3>По вашему запросу ничего не найдено</h3>
                <p>Попробуйте изменить фильтры или оставьте заявку — подберём офис под ваши задачи.</p>
                <div className="acts">
                  <button className="btn btn-primary" onClick={() => navSection("cat-lead")}>Оставить заявку</button>
                  <a className="btn btn-wa" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 16 })} WhatsApp</a>
                  <button className="btn btn-light" onClick={reset}>Сбросить фильтры</button>
                </div>
              </div>
            )}
          </div>

          {/* MAP (toggle) */}
          {showMap && (
            <div style={{ marginTop: 32 }}>
              <MapPlaceholder objects={filtered.length ? filtered : T.objects} height={500} />
            </div>
          )}
        </div>
      </section>

      {/* NOT FOUND CTA */}
      <section className="section" style={{ paddingTop: 0 }} id="cat-lead">
        <div className="container">
          <div className="cta-band">
            <span className="glow"></span>
            <div className="inner">
              <div>
                <h2>Не нашли подходящий офис?</h2>
                <p>Оставьте заявку — подберём вариант под площадь, локацию и формат вашего бизнеса. Или напишите в WhatsApp.</p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a className="btn btn-primary btn-lg" onClick={() => navSection("cat-form")}>Оставить заявку</a>
                <a className="btn btn-ghost-light btn-lg" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} WhatsApp</a>
              </div>
            </div>
          </div>
          <div id="cat-form" style={{ maxWidth: 760, margin: "44px auto 0" }}>
            <SectionHead center eyebrow="Заявка" title="Подберём офис под ваши задачи" />
            <LeadForm sourcePage="Каталог" />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======================= OBJECT PAGE ======================= */
function ObjectPage({ slug }) {
  const o = T.bySlug(slug);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!o) {
    return (
      <main style={{ paddingTop: 140, minHeight: "70vh" }}>
        <div className="container center" style={{ paddingBlock: 80 }}>
          <h1>Объект не найден</h1>
          <p style={{ marginTop: 14 }}>Возможно, объект был перемещён. Вернитесь в каталог.</p>
          <a className="btn btn-primary" style={{ marginTop: 22 }} onClick={() => go("/catalog")}>В каталог</a>
        </div>
      </main>
    );
  }
  const similar = T.similarFor(o);
  const groups = Object.entries(o.characteristics).filter(([, rows]) => rows && rows.length);

  return (
    <main>
      {/* TOP */}
      <section className="obj-hero">
        <span className="glow"></span>
        <div className="container inner">
          <div className="crumbs"><a onClick={() => go("/")}>Главная</a> / <a onClick={() => go("/catalog")}>Каталог</a> / <span>{o.title}</span></div>
          <h1 style={{ marginTop: 18 }}>{o.title}</h1>
          <div className="addrline">{Ic.pin({ s: 17 })} <span>{o.district} район · {o.address}, Алматы</span></div>
          <div className="meta">
            <ClassBadge o={o} dark />
            {o.classNote && <span className="badge badge-copper">{o.classNote}</span>}
            <StatusBadge status={o.status} />
            <span className="badge badge-outline" style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.24)" }}>{o.floors} этажей</span>
            {o.gbaLabel && (
              <span className="badge badge-outline" style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.24)" }}>{o.gbaLabel}</span>
            )}
          </div>
          <div className="cta">
            <a className="btn btn-primary btn-lg" onClick={() => navSection("obj-lead")}>Оставить заявку</a>
            <a className="btn btn-ghost-light btn-lg" href={WA(WT.object(o.title))} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Уточнить в WhatsApp</a>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section" style={{ paddingBottom: 0, paddingTop: "clamp(32px,4vw,56px)" }}>
        <div className="container">
          <div className="gallery-main"><PhotoSlot ph={o.title + " — главное фото"} src={o.photo} alt={o.title} /></div>
          <div className="gallery-thumbs">
            {[1, 2, 3, 4].map((i) => (
              <div className="gt" key={i}><PhotoSlot ph={"Фото " + i} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARACTERISTICS */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Характеристики" title="Основные характеристики объекта" />
          <div className="char-grid">
            {groups.map(([title, rows]) => (
              <div className="char-card" key={title}>
                <h4>{title}</h4>
                {rows.map(([k, v]) => (
                  <div className="char-row" key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      {o.infrastructure && o.infrastructure.length > 0 && (
        <section className="section band-tint" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead eyebrow="Локация" title="Инфраструктура рядом" text={o.shortDescription} />
            <div className="infra-list">
              {o.infrastructure.map((it) => (
                <span className="infra-chip" key={it}>{Ic.coffee({ s: 15 })} {it}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MAP */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow={<Fragment>{Ic.pin({ s: 14 })} На карте</Fragment>} title="Расположение объекта" text={o.address + ", Алматы · " + o.district + " район"} />
          <MapPlaceholder objects={[o]} height={420} single />
        </div>
      </section>

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section className="section band-tint" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead eyebrow="Похожие объекты" title="Ещё офисы для бизнеса" />
            <div className="cards-grid">
              {similar.map((s) => <SimilarCard key={s.slug} o={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* LEAD */}
      <section className="section" id="obj-lead">
        <div className="container">
          <div className="form-split">
            <div>
              <span className="eyebrow">Заявка по объекту</span>
              <h2 style={{ marginTop: 16, fontSize: "clamp(26px,3.2vw,40px)" }}>Узнать условия по {o.title}</h2>
              <p style={{ marginTop: 18, fontSize: 18 }}>Оставьте заявку — уточним доступные площади и условия аренды именно по этому объекту. Название уже подставлено в форму.</p>
              <a className="btn btn-wa btn-lg" style={{ marginTop: 24 }} href={WA(WT.object(o.title))} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Уточнить в WhatsApp</a>
            </div>
            <LeadForm sourcePage="Страница объекта" objectTitle={o.title} />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ======================= THANK YOU ======================= */
function ThankYou() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="ty-wrap">
      <span className="glow"></span>
      <div className="ty-card">
        <div className="ty-check">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h1>Спасибо! Заявка отправлена</h1>
        <p>Ваша заявка отправлена. Специалист свяжется с вами для уточнения деталей и подберёт подходящие офисные решения.</p>
        <div className="ty-actions">
          <a className="btn btn-primary btn-lg" onClick={() => go("/")}>Вернуться на главную</a>
          <a className="btn btn-light btn-lg" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Написать в WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

export { Home, Catalog, ObjectPage, ThankYou };
