import { go, navSection } from "../navigation.js";
import { Ic, ObjectCardCatalog } from "../components/ui-core.jsx";
import { MapPlaceholder, LeadForm } from "../components/ui-form-map.jsx";
import { CardsCarousel } from "../components/CardsCarousel.jsx";
import { CatalogPagination } from "../components/CatalogPagination.jsx";
import { SectionHead } from "../components/SectionHead.jsx";
import { useCatalogFilters } from "../hooks/useCatalogFilters.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useTMK } from "../hooks/useTMK.js";
import { FORMAT_KEYS } from "../i18n/index.js";

export function Catalog() {
  const { t } = useI18n();
  const { districts, classes, areaRanges, objects, waLink, WA_TEXT } = useTMK();
  const {
    q, district, cls, area, format, page, showMap,
    patchParams, filtered, paged, totalPages,
    active, reset, changePage,
  } = useCatalogFilters();

  const formatLabel = format && FORMAT_KEYS.includes(format) ? t(`formats.${format}`) : format;

  return (
    <main className="page-catalog">
      <section className="dark-band catalog-hero">
        <span className="glow" />
        <div className="container dark-band-inner catalog-hero-inner">
          <div className="crumbs"><a onClick={() => go("/")}>{t("common.home")}</a> / <span>{t("common.catalog")}</span></div>
          <h1 className="catalog-title">{t("catalog.title")}</h1>
          <p className="catalog-lead">{t("catalog.lead")}</p>
        </div>
      </section>

      <section className="section catalog-body">
        <div className="container">
          <div className="filters catalog-filters">
            <div className="row">
              <div className="ffield span2">
                <label>{t("catalog.nameLabel")}</label>
                <div className="search-wrap">
                  {Ic.search({ s: 18 })}
                  <input
                    className="control"
                    value={q}
                    onChange={(e) => patchParams({ q: e.target.value, page: null })}
                    placeholder={t("common.searchPlaceholder")}
                  />
                </div>
              </div>
              <div className="ffield">
                <label>{t("catalog.districtLabel")}</label>
                <select className="control" value={district} onChange={(e) => patchParams({ district: e.target.value, page: null })}>
                  <option value="">{t("common.allDistricts")}</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="ffield">
                <label>{t("catalog.classLabel")}</label>
                <select className="control" value={cls} onChange={(e) => patchParams({ class: e.target.value, page: null })}>
                  <option value="">{t("common.anyClass")}</option>
                  {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="ffield">
                <label>{t("catalog.areaLabel")}</label>
                <select className="control" value={area} onChange={(e) => patchParams({ area: e.target.value, page: null })}>
                  <option value="">{t("common.anyArea")}</option>
                  {areaRanges.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="filters-meta">
              <div className="count">
                {t("common.found")} <b>{filtered.length}</b> {t("common.of")} {objects.length}{active ? "" : ` ${t("common.objectsWord")}`}
                {format && (
                  <span className="format-chip">
                    {t("common.formatLabel")} {formatLabel}
                    <button type="button" className="format-chip-x" onClick={() => patchParams({ format: null })} aria-label={t("common.resetFormat")}>×</button>
                  </span>
                )}
              </div>
              <div className="filters-actions">
                {active && <button type="button" className="reset-btn" onClick={reset}>{t("common.resetFilters")}</button>}
                <button type="button" className="btn btn-light btn-sm toggle-map" onClick={() => patchParams({ map: showMap ? null : "1" })}>
                  {Ic.pin({ s: 15 })} {showMap ? t("common.hideMap") : t("common.showMap")}
                </button>
              </div>
            </div>
          </div>

          <CatalogPagination page={page} totalPages={totalPages} onChange={changePage} />

          <div className="catalog-grid">
            {filtered.length > 0 ? (
              <CardsCarousel className="catalog" resetKey={page + "-" + (paged[0]?.slug ?? "empty")}>
                {paged.map((o) => <ObjectCardCatalog key={o.slug} o={o} />)}
              </CardsCarousel>
            ) : (
              <div className="empty-state">
                <h3>{t("catalog.emptyTitle")}</h3>
                <p>{t("catalog.emptyText")}</p>
                <div className="acts">
                  <button type="button" className="btn btn-primary" onClick={() => navSection("cat-lead")}>{t("common.submitLead")}</button>
                  <a className="btn btn-wa" href={waLink(WA_TEXT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 16 })} {t("common.whatsapp")}</a>
                  <button type="button" className="btn btn-light" onClick={reset}>{t("common.resetFilters")}</button>
                </div>
              </div>
            )}
          </div>

          {showMap && (
            <div className="catalog-map">
              <MapPlaceholder objects={filtered.length ? filtered : objects} height={500} />
            </div>
          )}
        </div>
      </section>

      <section className="section catalog-cta" id="cat-lead">
        <div className="container">
          <div className="cta-band">
            <span className="glow" />
            <div className="inner">
              <div>
                <h2>{t("catalog.ctaTitle")}</h2>
                <p>{t("catalog.ctaText")}</p>
              </div>
              <div className="cta-row">
                <a className="btn btn-primary btn-lg" onClick={() => navSection("cat-form")}>{t("common.submitLead")}</a>
                <a className="btn btn-ghost-light btn-lg" href={waLink(WA_TEXT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} {t("common.whatsapp")}</a>
              </div>
            </div>
          </div>
          <div id="cat-form" className="catalog-form">
            <SectionHead center eyebrow={t("catalog.formEyebrow")} title={t("catalog.formTitle")} />
            <LeadForm sourcePage={t("catalog.sourcePage")} defaultFormat={format} />
          </div>
        </div>
      </section>
    </main>
  );
}
