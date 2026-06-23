import TMK from "../data.js";
import { go, navSection } from "../navigation.js";
import { Ic, WA, WT, PhotoSlot, ObjectCardMain, PartnersStrip } from "../components/ui-core.jsx";
import { LeadForm } from "../components/ui-form-map.jsx";
import { MapLeaflet } from "../components/MapLeaflet.jsx";
import { CardsCarousel } from "../components/CardsCarousel.jsx";
import { SectionHead } from "../components/SectionHead.jsx";
import { HeroSearchBar } from "../components/HeroSearchBar.jsx";

const FEATURED = ["esentai-tower", "abylai-khan-plaza", "capital-tower", "ken-dala", "almaty-plaza", "bnc-plaza"];

const FORMATS = [
  { ic: Ic.briefcase, t: "Офис", d: "Классический офис в бизнес-центре под аренду: выбираете площадь и этаж под структуру команды." },
  { ic: Ic.sparkle, t: "Сервисный офис", d: "Готовое рабочее пространство с мебелью, инфраструктурой и обслуживанием — можно заехать быстрее." },
  { ic: Ic.key, t: "Офис под ключ", d: "Решение под задачи бизнеса: подбор, планировка и подготовка пространства к заезду." },
];

const WHY = [
  ["Коммерческая недвижимость", "Работаем с офисами и коммерческими объектами разных классов и форматов в Алматы."],
  ["Подбор под задачи бизнеса", "Помогаем выбрать площадь, локацию и формат, исходя из структуры и планов вашей компании."],
  ["Сопровождение заявки", "Ведём вас от первого обращения до согласования условий аренды с собственником."],
  ["Разные форматы решений", "Офис, сервисный офис или решение под ключ — подбираем подходящий вариант."],
];

const SERVICED_TILES = [
  ["Меблировка", "Готовые рабочие места"],
  ["Инфраструктура", "Интернет, переговорные"],
  ["Обслуживание", "Клининг и управление"],
  ["Быстрый заезд", "Минимум подготовки"],
];

const ABOUT_TILES = [
  [Ic.briefcase, "Офисы"],
  [Ic.layers, "Склады"],
  [Ic.building, "Торговые помещения"],
  [Ic.route, "Земельные участки"],
];

export function Home() {
  const featured = FEATURED.map(TMK.bySlug);
  const mapObjects = TMK.objects.filter((o) => o.coords != null);
  const hero = TMK.bySlug("esentai-tower");

  return (
    <main>
      <section className="hero">
        <span className="glow" />
        <span className="glow2" />
        <div className="container hero-inner">
          <div className="hero-grid">
            <div>
              <span className="eyebrow on-dark">Коммерческая недвижимость · Алматы</span>
              <h1 style={{ marginTop: 20 }}>Офисы для бизнеса в Алматы</h1>
              <p className="sub">Подберём офис, сервисное пространство или решение под ключ под задачи вашей компании — с сопровождением заявки на каждом этапе.</p>
              <HeroSearchBar />
              <div className="stat-row">
                <div className="s"><b>350 000+</b><span>м² в управлении</span></div>
                <div className="stat-divider" />
                <div className="s"><b>15</b><span>офисных объектов</span></div>
                <div className="stat-divider" />
                <div className="s"><b>A–B</b><span>классы зданий</span></div>
              </div>
            </div>
            <div className="hero-card">
              <span className="chip">Класс A</span>
              <PhotoSlot ph="Esentai Tower — обложка" src={hero.photo} alt="Esentai Tower" />
              <div className="tagline">
                <b>Esentai Tower</b>
                <span>Бостандыкский район · Аль-Фараби 77/7 · от 1 413 м²/этаж</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="catalog-quick">
        <div className="container">
          <div className="section-head-row">
            <div className="section-head" style={{ margin: 0 }}>
              <span className="eyebrow">Каталог объектов</span>
              <h2 style={{ marginTop: 16 }}>Офисные объекты в аренду</h2>
              <p style={{ marginTop: 14 }}>Подборка бизнес-центров Алматы. Полный список — в каталоге с фильтрами.</p>
            </div>
            <a className="btn btn-light" onClick={() => go("/catalog")}>Весь каталог {Ic.arrow({ s: 15 })}</a>
          </div>
          <CardsCarousel>
            {featured.map((o) => <ObjectCardMain key={o.slug} o={o} />)}
          </CardsCarousel>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead eyebrow={<>{Ic.pin({ s: 14 })} На карте</>} title="Все объекты на карте Алматы" />
          <MapLeaflet objects={mapObjects} />
        </div>
      </section>

      <section className="dark-band section" id="serviced">
        <span className="glow" />
        <div className="container dark-band-inner">
          <div className="form-split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark">Формат</span>
              <h2 className="dark-title">Что такое сервисный офис</h2>
              <p className="dark-text">
                Сервисный офис — это готовое рабочее пространство с мебелью, инфраструктурой и обслуживанием. В него можно заехать быстрее, чем оборудовать офис с нуля: меблировка, интернет, охрана и управление зданием уже на месте.
              </p>
              <div className="dark-cta">
                <a className="btn btn-primary" onClick={() => navSection("lead")}>Подобрать сервисный офис</a>
                <a className="btn btn-ghost-light" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 17 })} Спросить в WhatsApp</a>
              </div>
            </div>
            <div className="tile-grid">
              {SERVICED_TILES.map(([t, d]) => (
                <div key={t} className="dark-tile">
                  <div className="dark-tile-title">{t}</div>
                  <div className="dark-tile-desc">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="formats">
        <div className="container">
          <SectionHead
            eyebrow="Форматы офисных решений"
            title="Под разные задачи бизнеса"
            text="Эти форматы помогают точнее описать запрос в заявке — выбор формата не ограничивает каталог."
          />
          <div className="feature-grid">
            {FORMATS.map((f, i) => (
              <div className={"feature" + (i === 1 ? " accent" : "")} key={f.t}>
                <div className="ico">{f.ic({ s: 24 })}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-tint">
        <div className="container">
          <SectionHead eyebrow="Почему выбирают нас" title="Надёжный партнёр по аренде офисов" />
          <div className="why-grid">
            {WHY.map(([t, d], i) => (
              <div className="why-item" key={t}>
                <div className="n">{i + 1}</div>
                <div><h4>{t}</h4><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Партнёры"
            title="Компании, с которыми работала команда"
            text="Партнёры и компании, с которыми работала команда. Кейсы не приводим — только опыт сотрудничества."
          />
          <PartnersStrip />
        </div>
      </section>

      <section className="section dark-band" id="about">
        <span className="glow" />
        <div className="container dark-band-inner">
          <div className="form-split" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow on-dark">О компании</span>
              <h2 className="dark-title">Опыт в коммерческой недвижимости</h2>
              <p className="dark-text">
                Команда работает с коммерческой недвижимостью Алматы: офисы, склады, торговые помещения, земельные участки и другие направления. Мы помогаем бизнесу находить подходящие площади и сопровождаем сделку до заезда.
              </p>
              <div className="about-stats">
                <div className="about-stats-row">
                  <div className="s"><b>350 000+</b><span>м² в управлении</span></div>
                  <div className="stat-divider" />
                  <div className="s"><b>Алматы</b><span>география работы</span></div>
                </div>
              </div>
            </div>
            <div className="tile-grid">
              {ABOUT_TILES.map(([ic, t]) => (
                <div key={t} className="dark-tile dark-tile--icon">
                  <div className="dark-tile-icon">{ic({ s: 26 })}</div>
                  <div className="dark-tile-title">{t}</div>
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
              <span className="eyebrow">Заявка</span>
              <h2 className="page-title">Подберём офис под ваши задачи</h2>
              <p className="page-lead">Оставьте заявку — уточним доступные площади и условия и подберём подходящие варианты. Или напишите нам в WhatsApp.</p>
              <a className="btn btn-wa btn-lg" style={{ marginTop: 24 }} href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Написать в WhatsApp</a>
            </div>
            <LeadForm sourcePage="Главная" />
          </div>
        </div>
      </section>
    </main>
  );
}
