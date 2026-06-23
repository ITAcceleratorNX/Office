import TMK from "../data.js";
import { go, navSection } from "../navigation.js";
import { Ic, WA, WT, ObjectCardCatalog } from "../components/ui-core.jsx";
import { MapPlaceholder, LeadForm } from "../components/ui-form-map.jsx";
import { CardsCarousel } from "../components/CardsCarousel.jsx";
import { CatalogPagination } from "../components/CatalogPagination.jsx";
import { SectionHead } from "../components/SectionHead.jsx";
import { useCatalogFilters } from "../hooks/useCatalogFilters.js";

export function Catalog() {
  const {
    q, district, cls, area, format, page, showMap,
    patchParams, filtered, paged, totalPages,
    active, reset, changePage,
  } = useCatalogFilters();

  return (
    <main className="page-catalog">
      <section className="dark-band catalog-hero">
        <span className="glow" />
        <div className="container dark-band-inner catalog-hero-inner">
          <div className="crumbs"><a onClick={() => go("/")}>Главная</a> / <span>Каталог</span></div>
          <h1 className="catalog-title">Каталог офисных объектов</h1>
          <p className="catalog-lead">
            Бизнес-центры Алматы для аренды. Используйте фильтры по названию, району, классу и площади.
          </p>
        </div>
      </section>

      <section className="section catalog-body">
        <div className="container">
          <div className="filters catalog-filters">
            <div className="row">
              <div className="ffield span2">
                <label>Название бизнес-центра</label>
                <div className="search-wrap">
                  {Ic.search({ s: 18 })}
                  <input
                    className="control"
                    value={q}
                    onChange={(e) => patchParams({ q: e.target.value, page: null })}
                    placeholder="Поиск по названию"
                  />
                </div>
              </div>
              <div className="ffield">
                <label>Район</label>
                <select className="control" value={district} onChange={(e) => patchParams({ district: e.target.value, page: null })}>
                  <option value="">Все районы</option>
                  {TMK.districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="ffield">
                <label>Класс</label>
                <select className="control" value={cls} onChange={(e) => patchParams({ class: e.target.value, page: null })}>
                  <option value="">Любой класс</option>
                  {TMK.classes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="ffield">
                <label>Площадь</label>
                <select className="control" value={area} onChange={(e) => patchParams({ area: e.target.value, page: null })}>
                  <option value="">Любая площадь</option>
                  {TMK.areaRanges.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="filters-meta">
              <div className="count">
                Найдено: <b>{filtered.length}</b> из {TMK.objects.length}{active ? "" : " объектов"}
                {format && (
                  <span className="format-chip">
                    Формат: {format}
                    <button type="button" className="format-chip-x" onClick={() => patchParams({ format: null })} aria-label="Сбросить формат">×</button>
                  </span>
                )}
              </div>
              <div className="filters-actions">
                {active && <button type="button" className="reset-btn" onClick={reset}>✕ Сбросить фильтры</button>}
                <button type="button" className="btn btn-light btn-sm toggle-map" onClick={() => patchParams({ map: showMap ? null : "1" })}>
                  {Ic.pin({ s: 15 })} {showMap ? "Скрыть карту" : "Показать на карте"}
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
                <h3>По вашему запросу ничего не найдено</h3>
                <p>Попробуйте изменить фильтры или оставьте заявку — подберём офис под ваши задачи.</p>
                <div className="acts">
                  <button type="button" className="btn btn-primary" onClick={() => navSection("cat-lead")}>Оставить заявку</button>
                  <a className="btn btn-wa" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 16 })} WhatsApp</a>
                  <button type="button" className="btn btn-light" onClick={reset}>Сбросить фильтры</button>
                </div>
              </div>
            )}
          </div>

          {showMap && (
            <div className="catalog-map">
              <MapPlaceholder objects={filtered.length ? filtered : TMK.objects} height={500} />
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
                <h2>Не нашли подходящий офис?</h2>
                <p>Оставьте заявку — подберём вариант под площадь, локацию и формат вашего бизнеса. Или напишите в WhatsApp.</p>
              </div>
              <div className="cta-row">
                <a className="btn btn-primary btn-lg" onClick={() => navSection("cat-form")}>Оставить заявку</a>
                <a className="btn btn-ghost-light btn-lg" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} WhatsApp</a>
              </div>
            </div>
          </div>
          <div id="cat-form" className="catalog-form">
            <SectionHead center eyebrow="Заявка" title="Подберём офис под ваши задачи" />
            <LeadForm sourcePage="Каталог" defaultFormat={format} />
          </div>
        </div>
      </section>
    </main>
  );
}
