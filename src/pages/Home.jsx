import { go, navSection } from "../navigation.js";
import { Ic, PhotoSlot, ObjectCardMain, PartnersStrip } from "../components/ui-core.jsx";
import { LeadForm } from "../components/ui-form-map.jsx";
import { MapLeaflet } from "../components/MapLeaflet.jsx";
import { CardsCarousel } from "../components/CardsCarousel.jsx";
import { SectionHead } from "../components/SectionHead.jsx";
import { HeroSearchBar } from "../components/HeroSearchBar.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useTMK } from "../hooks/useTMK.js";

const FEATURED = ["esentai-tower", "abylai-khan-plaza", "capital-tower", "ken-dala", "almaty-plaza", "bnc-plaza"];
const FORMAT_ICONS = [Ic.briefcase, Ic.sparkle, Ic.key];
const ABOUT_ICONS = [Ic.briefcase, Ic.layers, Ic.building, Ic.route];

export function Home() {
  const { t } = useI18n();
  const { bySlug, objects, waLink, WA_TEXT } = useTMK();
  const featured = FEATURED.map(bySlug);
  const mapObjects = objects.filter((o) => o.coords != null);
  const hero = bySlug("esentai-tower");

  return (
    <main>
      <section className="hero">
        <span className="glow" />
        <span className="glow2" />
        <div className="container hero-inner">
          <div className="hero-grid">
            <div>
              <span className="eyebrow on-dark">{t("home.eyebrow")}</span>
              <h1 style={{ marginTop: 20 }}>{t("home.title")}</h1>
              <p className="sub">{t("home.sub")}</p>
              <HeroSearchBar />
              <div className="stat-row">
                <div className="s"><b>350 000+</b><span>{t("home.statArea")}</span></div>
                <div className="stat-divider" />
                <div className="s"><b>15</b><span>{t("home.statObjects")}</span></div>
                <div className="stat-divider" />
                <div className="s"><b>A–B</b><span>{t("home.statClasses")}</span></div>
              </div>
            </div>
            <div className="hero-card">
              <span className="chip">{t("home.heroChip")}</span>
              <PhotoSlot ph="Esentai Tower — обложка" src={hero.photo} alt="Esentai Tower" />
              <div className="tagline">
                <b>Esentai Tower</b>
                <span>Бостандыкский {t("common.districtSuffix")} · Аль-Фараби 77/7 · {t("home.heroFloor")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="catalog-quick">
        <div className="container">
          <div className="section-head-row">
            <div className="section-head" style={{ margin: 0 }}>
              <span className="eyebrow">{t("home.catalogEyebrow")}</span>
              <h2 style={{ marginTop: 16 }}>{t("home.catalogTitle")}</h2>
              <p style={{ marginTop: 14 }}>{t("home.catalogText")}</p>
            </div>
            <a className="btn btn-light" onClick={() => go("/catalog")}>{t("common.fullCatalog")} {Ic.arrow({ s: 15 })}</a>
          </div>
          <CardsCarousel>
            {featured.map((o) => <ObjectCardMain key={o.slug} o={o} />)}
          </CardsCarousel>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead eyebrow={<>{Ic.pin({ s: 14 })} {t("common.onMap")}</>} title={t("home.mapTitle")} />
          <MapLeaflet objects={mapObjects} />
        </div>
      </section>

      <section className="dark-band section" id="serviced">
        <span className="glow" />
        <div className="container dark-band-inner">
          <div className="form-split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark">{t("home.servicedEyebrow")}</span>
              <h2 className="dark-title">{t("home.servicedTitle")}</h2>
              <p className="dark-text">{t("home.servicedText")}</p>
              <div className="dark-cta">
                <a className="btn btn-primary" onClick={() => navSection("lead")}>{t("home.pickServiced")}</a>
                <a className="btn btn-ghost-light" href={waLink(WA_TEXT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 17 })} {t("common.askWhatsapp")}</a>
              </div>
            </div>
            <div className="tile-grid">
              {t("home.servicedTiles").map(([tileTitle, tileDesc]) => (
                <div key={tileTitle} className="dark-tile">
                  <div className="dark-tile-title">{tileTitle}</div>
                  <div className="dark-tile-desc">{tileDesc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="formats">
        <div className="container">
          <SectionHead
            eyebrow={t("home.formatsEyebrow")}
            title={t("home.formatsTitle")}
            text={t("home.formatsText")}
          />
          <div className="feature-grid">
            {t("home.formatCards").map(([title, desc], i) => (
              <div className={"feature" + (i === 1 ? " accent" : "")} key={title}>
                <div className="ico">{FORMAT_ICONS[i]({ s: 24 })}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-tint">
        <div className="container">
          <SectionHead eyebrow={t("home.whyEyebrow")} title={t("home.whyTitle")} />
          <div className="why-grid">
            {t("home.whyItems").map(([title, desc], i) => (
              <div className="why-item" key={title}>
                <div className="n">{i + 1}</div>
                <div><h4>{title}</h4><p>{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow={t("home.partnersEyebrow")}
            title={t("home.partnersTitle")}
            text={t("home.partnersText")}
          />
          <PartnersStrip />
        </div>
      </section>

      <section className="section dark-band" id="about">
        <span className="glow" />
        <div className="container dark-band-inner">
          <div className="form-split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark">{t("home.aboutEyebrow")}</span>
              <h2 className="dark-title">{t("home.aboutTitle")}</h2>
              <p className="dark-text">{t("home.aboutText")}</p>
              <div className="about-stats">
                <div className="about-stats-row">
                  <div className="s"><b>350 000+</b><span>{t("home.statArea")}</span></div>
                  <div className="stat-divider" />
                  <div className="s"><b>{t("common.almaty")}</b><span>{t("home.aboutStatGeo")}</span></div>
                </div>
              </div>
            </div>
            <div className="tile-grid">
              {t("home.aboutTiles").map((tileTitle, i) => (
                <div key={tileTitle} className="dark-tile dark-tile--icon">
                  <div className="dark-tile-icon">{ABOUT_ICONS[i]({ s: 26 })}</div>
                  <div className="dark-tile-title">{tileTitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="lead">
        <div className="container">
          <div className="form-split">
            <div>
              <span className="eyebrow">{t("home.leadEyebrow")}</span>
              <h2 className="page-title">{t("home.leadTitle")}</h2>
              <p className="page-lead">{t("home.leadText")}</p>
              <a className="btn btn-wa btn-lg" style={{ marginTop: 24 }} href={waLink(WA_TEXT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} {t("common.writeWhatsapp")}</a>
            </div>
            <LeadForm sourcePage={t("home.sourcePage")} />
          </div>
        </div>
      </section>
    </main>
  );
}
