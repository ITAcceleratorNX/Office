import { Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TMK from "../data.js";
import { go, navSection, catalogLinkFrom } from "../navigation.js";
import {
  Ic, WA, WT, ClassBadge, StatusBadge, SimilarCard,
} from "../components/ui-core.jsx";
import { LeadForm } from "../components/ui-form-map.jsx";
import { MapLeaflet } from "../components/MapLeaflet.jsx";
import { PhotoCarousel } from "../components/PhotoCarousel.jsx";
import { SectionHead } from "../components/SectionHead.jsx";

export function ObjectPage({ slug }) {
  const o = TMK.bySlug(slug);
  const location = useLocation();
  const navigate = useNavigate();
  const catalogHref = catalogLinkFrom(location.state?.from);
  const canGoBack = Boolean(location.state?.from);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!o) {
    return (
      <main className="page-not-found">
        <div className="container center">
          <h1>Объект не найден</h1>
          <p>Возможно, объект был перемещён. Вернитесь в каталог.</p>
          <a className="btn btn-primary" onClick={() => go("/catalog")}>В каталог</a>
        </div>
      </main>
    );
  }

  const similar = TMK.similarFor(o);
  const groups = Object.entries(o.characteristics).filter(([, rows]) => rows?.length);

  return (
    <main>
      <section className="obj-hero">
        <span className="glow" />
        <div className="container inner">
          <div className="crumbs">
            {canGoBack && (
              <button type="button" className="crumbs-back" onClick={() => navigate(-1)}>← Назад</button>
            )}
            <a onClick={() => go("/")}>Главная</a> / <a onClick={() => go(catalogHref)}>Каталог</a> / <span>{o.title}</span>
          </div>
          <h1>{o.title}</h1>
          <div className="addrline">{Ic.pin({ s: 17 })} <span>{o.district} район · {o.address}, Алматы</span></div>
          <div className="meta">
            <ClassBadge o={o} dark />
            {o.classNote && <span className="badge badge-copper">{o.classNote}</span>}
            <StatusBadge status={o.status} />
            {o.floors != null && <span className="badge badge-outline badge-outline--light">{o.floors} этажей</span>}
            {o.gbaLabel && <span className="badge badge-outline badge-outline--light">{o.gbaLabel}</span>}
          </div>
          <div className="cta">
            <a className="btn btn-primary btn-lg" onClick={() => navSection("obj-lead")}>Оставить заявку</a>
            <a className="btn btn-ghost-light btn-lg" href={WA(WT.object(o.title))} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Уточнить в WhatsApp</a>
          </div>
        </div>
      </section>

      <PhotoCarousel title={o.title} photos={o.gallery} fallback={o.cover} />

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

      {o.infrastructure?.length > 0 && (
        <section className="section band-tint section--tight-top">
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

      <section className="section section--tight-top">
        <div className="container">
          <SectionHead
            eyebrow={<Fragment>{Ic.pin({ s: 14 })} На карте</Fragment>}
            title="Расположение объекта"
            text={`${o.address}, Алматы · ${o.district} район`}
          />
          {o.coords != null ? (
            <MapLeaflet objects={[o]} single />
          ) : (
            <div className="map-ph map-ph--empty">
              <p>{Ic.pin({ s: 17 })} {o.address}, Алматы · {o.district} район</p>
            </div>
          )}
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section band-tint section--tight-top">
          <div className="container">
            <SectionHead eyebrow="Похожие объекты" title="Ещё офисы для бизнеса" />
            <div className="cards-grid">
              {similar.map((s) => <SimilarCard key={s.slug} o={s} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="obj-lead">
        <div className="container">
          <div className="form-split">
            <div>
              <span className="eyebrow">Заявка по объекту</span>
              <h2 className="page-title">Узнать условия по {o.title}</h2>
              <p className="page-lead">Оставьте заявку — уточним доступные площади и условия аренды именно по этому объекту. Название уже подставлено в форму.</p>
              <a className="btn btn-wa btn-lg" style={{ marginTop: 24 }} href={WA(WT.object(o.title))} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Уточнить в WhatsApp</a>
            </div>
            <LeadForm sourcePage="Страница объекта" objectTitle={o.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
