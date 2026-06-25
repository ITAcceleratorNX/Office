import { Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { go, navSection, catalogLinkFrom } from "../navigation.js";
import {
  Ic, ClassBadge, StatusBadge, SimilarCard,
} from "../components/ui-core.jsx";
import { LeadForm } from "../components/ui-form-map.jsx";
import { MapLeaflet } from "../components/MapLeaflet.jsx";
import { PhotoCarousel } from "../components/PhotoCarousel.jsx";
import { SectionHead } from "../components/SectionHead.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useTMK } from "../hooks/useTMK.js";

export function ObjectPage({ slug }) {
  const { t } = useI18n();
  const { bySlug, similarFor, waLink, WA_TEXT } = useTMK();
  const o = bySlug(slug);
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
          <h1>{t("object.notFoundTitle")}</h1>
          <p>{t("object.notFoundText")}</p>
          <a className="btn btn-primary" onClick={() => go("/catalog")}>{t("common.toCatalog")}</a>
        </div>
      </main>
    );
  }

  const similar = similarFor(o);
  const groups = Object.entries(o.characteristics).filter(([, rows]) => rows?.length);

  return (
    <main>
      <section className="obj-hero">
        <span className="glow" />
        <div className="container inner">
          <div className="crumbs">
            {canGoBack && (
              <button type="button" className="crumbs-back" onClick={() => navigate(-1)}>{t("common.back")}</button>
            )}
            <a onClick={() => go("/")}>{t("common.home")}</a> / <a onClick={() => go(catalogHref)}>{t("common.catalog")}</a> / <span>{o.title}</span>
          </div>
          <h1>{o.title}</h1>
          <div className="addrline">{Ic.pin({ s: 17 })} <span>{o.districtLabel ?? o.district} {t("common.districtSuffix")} · {o.address}, {t("common.almaty")}</span></div>
          <div className="meta">
            <ClassBadge o={o} dark />
            {o.classNote && <span className="badge badge-copper">{o.classNote}</span>}
            <StatusBadge status={o.status} />
            {o.floors != null && <span className="badge badge-outline badge-outline--light">{o.floors} {t("common.floors")}</span>}
            {o.gbaLabel && <span className="badge badge-outline badge-outline--light">{o.gbaLabel}</span>}
          </div>
          <div className="cta">
            <a className="btn btn-primary btn-lg" onClick={() => navSection("obj-lead")}>{t("common.submitLead")}</a>
            <a className="btn btn-ghost-light btn-lg" href={waLink(WA_TEXT.object(o.title))} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} {t("common.clarifyWhatsapp")}</a>
          </div>
        </div>
      </section>

      <PhotoCarousel title={o.title} photos={o.gallery} fallback={o.cover} />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t("object.charsEyebrow")} title={t("object.charsTitle")} />
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
            <SectionHead eyebrow={t("object.infraEyebrow")} title={t("object.infraTitle")} text={o.shortDescription} />
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
            eyebrow={<Fragment>{Ic.pin({ s: 14 })} {t("common.onMap")}</Fragment>}
            title={t("object.mapTitle")}
            text={`${o.address}, ${t("common.almaty")} · ${o.districtLabel ?? o.district} ${t("common.districtSuffix")}`}
          />
          {o.coords != null ? (
            <MapLeaflet objects={[o]} single />
          ) : (
            <div className="map-ph map-ph--empty">
              <p>{Ic.pin({ s: 17 })} {o.address}, {t("common.almaty")} · {o.districtLabel ?? o.district} {t("common.districtSuffix")}</p>
            </div>
          )}
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section band-tint section--tight-top">
          <div className="container">
            <SectionHead eyebrow={t("object.similarEyebrow")} title={t("object.similarTitle")} />
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
              <span className="eyebrow">{t("object.leadEyebrow")}</span>
              <h2 className="page-title">{t("object.leadTitle", { title: o.title })}</h2>
              <p className="page-lead">{t("object.leadText")}</p>
              <a className="btn btn-wa btn-lg" style={{ marginTop: 24 }} href={waLink(WA_TEXT.object(o.title))} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} {t("common.clarifyWhatsapp")}</a>
            </div>
            <LeadForm sourcePage={t("object.sourcePage")} objectTitle={o.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
