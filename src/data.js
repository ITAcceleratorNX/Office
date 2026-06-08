import { buildExtraObjects, finalizeCatalog } from "./catalog-extra.js";
  const WA_NUMBER = "77009737138";
  const WA_TEXT = {
    general: "Здравствуйте! Интересует аренда коммерческой недвижимости. Подскажите, пожалуйста, какие офисы доступны?",
    card: (name) => `Здравствуйте! Интересует аренда офиса в ${name}. Подскажите, пожалуйста, какие варианты доступны?`,
    object: (name) => `Здравствуйте! Интересует аренда офиса в ${name}. Хотел бы уточнить условия и доступные площади.`,
  };
  function waLink(text) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  // Map bounding box for the stylized placeholder map (approx central Almaty)
  const MAP_BOUNDS = { latMin: 43.205, latMax: 43.262, lngMin: 76.900, lngMax: 76.968 };

  // Districts (only those that actually exist in the data)
  const STATUS = {
    active:  { label: "Введён в эксплуатацию", tone: "status" },
    reno:    { label: "Проект в реновации",    tone: "reno" },
    launch:  { label: "На стадии запуска",     tone: "launch" },
  };

  const EXISTING_OBJECTS = [
    {
      id: 1, slug: "green-tower", photo: "/assets/objects/green-tower.jpg", title: "БЦ Green Tower",
      district: "Медеуский", address: "Достык 192/2",
      buildingClass: "A", classKeys: ["A"], classNote: "BREEAM · зелёный офис",
      gba: 11000, gbaLabel: "11 000 м²", gfaLabel: "900 м²/этаж",
      floors: 12, parking: "120 мест", status: "active",
      coords: { lat: 43.233, lng: 76.956 },
      shortDescription: "Сертифицированный по BREEAM «зелёный» бизнес-центр класса A на верхнем Достыке с панорамным остеклением и центральной инженерией.",
      similar: ["triumph", "koktem-towers", "dial-plaza"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "11 000 м²"],
          ["Площадь этажа (GFA)", "900 м²"],
        ],
        "Здание": [
          ["Класс", "A · BREEAM"],
          ["Этажность", "12 этажей"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Статус", "Введён в эксплуатацию"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "120 мест"],
          ["Охрана", "24/7"],
          ["Доступ в здание", "24/7"],
        ],
      },
      infrastructure: ["Кофейня", "Магазины", "Аптеки", "ТРЦ"],
    },
    {
      id: 2, slug: "triumph", photo: "/assets/objects/triumph.jpg", title: "БЦ Triumph",
      district: "Медеуский", address: "Достык 192",
      buildingClass: "B+", classKeys: ["B+"], classNote: "",
      gba: 2500, gbaLabel: "2 500 м²", gfaLabel: "313 м²/этаж",
      floors: 8, parking: "120 мест", status: "active",
      coords: { lat: 43.2335, lng: 76.9552 },
      shortDescription: "Камерный бизнес-центр класса B+ на Достыке с удобной нарезкой этажей и развитой инфраструктурой рядом.",
      similar: ["koktem-towers", "green-tower", "venus"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "2 500 м²"],
          ["Площадь этажа (GFA)", "313 м²"],
        ],
        "Здание": [
          ["Класс", "B+"],
          ["Этажность", "8 этажей"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Статус", "Введён в эксплуатацию"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "120 мест"],
          ["Охрана", "24/7"],
          ["Доступ в здание", "24/7"],
        ],
      },
      infrastructure: ["Кофейня", "Магазины", "Аптеки", "ТРЦ"],
    },
    {
      id: 3, slug: "koktem-towers", photo: "/assets/objects/koktem-towers.jpg", title: "БЦ Koktem-Towers",
      district: "Медеуский", address: "Достык 180",
      buildingClass: "B+", classKeys: ["B+"], classNote: "",
      gba: 5000, gbaLabel: "5 000 м²", gfaLabel: "400 м²/этаж",
      floors: 9, parking: "110 мест", status: "active",
      coords: { lat: 43.236, lng: 76.954 },
      shortDescription: "Бизнес-центр класса B+ на Достыке с просторными этажами и гибкой планировкой под команды разного размера.",
      similar: ["triumph", "koktem-grand", "green-tower"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "5 000 м²"],
          ["Площадь этажа (GFA)", "400 м²"],
        ],
        "Здание": [
          ["Класс", "B+"],
          ["Этажность", "9 этажей"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Статус", "Введён в эксплуатацию"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "110 мест"],
          ["Охрана", "24/7"],
          ["Доступ в здание", "24/7"],
        ],
      },
      infrastructure: ["Кофейня", "Магазины", "Аптеки", "ТРЦ"],
    },
    {
      id: 4, slug: "koktem-grand", photo: "/assets/objects/koktem-grand.jpg", title: "БЦ Koktem Grand",
      district: "Медеуский", address: "Достык 210",
      buildingClass: "B", classKeys: ["B"], classNote: "",
      gba: 56400, gbaLabel: "56 400 м²", gfaLabel: "1 300 м²/этаж",
      floors: 14, parking: "Более 300 мест", status: "active",
      coords: { lat: 43.230, lng: 76.957 },
      shortDescription: "Масштабный бизнес-центр класса B на верхнем Достыке: крупные этажи по 1 300 м² и более 300 мест паркинга.",
      similar: ["koktem-towers", "venus", "nurly-tau"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "56 400 м²"],
          ["Площадь этажа (GFA)", "1 300 м²"],
        ],
        "Здание": [
          ["Класс", "B"],
          ["Этажность", "14 этажей"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Статус", "Введён в эксплуатацию"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "Более 300 мест"],
          ["Охрана", "24/7"],
          ["Доступ в здание", "24/7"],
        ],
      },
      infrastructure: ["Кофейня", "Магазины", "Аптеки", "ТРЦ"],
    },
    {
      id: 5, slug: "venus", photo: "/assets/objects/venus.jpg", title: "БЦ VENUS",
      district: "Медеуский", address: "Елебекова 10",
      buildingClass: "B+", classKeys: ["B+"], classNote: "",
      gba: 22000, gbaLabel: "22 000 м²", gfaLabel: "700 м²/этаж",
      floors: 3, parking: "Более 50 мест", status: "active",
      coords: { lat: 43.228, lng: 76.958 },
      shortDescription: "Бизнес-центр класса B+ под управлением TMK Limited (1 блок) с просторными этажами и центральной инженерией.",
      similar: ["koktem-grand", "triumph", "teniz-towers"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "22 000 м²"],
          ["Площадь этажа (GFA)", "700 м²"],
        ],
        "Здание": [
          ["Класс", "B+"],
          ["Этажность", "3 этажа"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Управляющая компания", "TMK Limited (1 блок)"],
          ["Статус", "Введён в эксплуатацию"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "Более 50 мест"],
          ["Охрана", "24/7"],
          ["Доступ в здание", "24/7"],
        ],
      },
      infrastructure: ["Кофейня", "Магазины", "Аптеки", "ТРЦ"],
    },
    {
      id: 6, slug: "dial-plaza", photo: "/assets/objects/dial-plaza.jpg", title: "БЦ Dial Plaza",
      district: "Алмалинский", address: "Сейфулина 541",
      buildingClass: "A", classKeys: ["A"], classNote: "",
      gba: 7400, gbaLabel: "7 400 м²", gfaLabel: "740 м²/этаж",
      floors: 10, parking: "Наземный паркинг", status: "active",
      coords: { lat: 43.255, lng: 76.940 },
      shortDescription: "Бизнес-центр класса A на Сейфуллина в деловой части города с наземным паркингом и удобным доступом.",
      similar: ["green-tower", "teniz-towers", "time-square"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "7 400 м²"],
          ["Площадь этажа (GFA)", "740 м²"],
        ],
        "Здание": [
          ["Класс", "A"],
          ["Этажность", "10 этажей"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Статус", "Введён в эксплуатацию"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "Наземный паркинг"],
          ["Охрана", "24/7"],
          ["Доступ в здание", "24/7"],
        ],
      },
      infrastructure: ["Банкоматы", "Магазины", "Аптеки"],
    },
    {
      id: 7, slug: "teniz-towers", photo: "/assets/objects/teniz-towers.jpg", title: "БЦ Teniz Towers",
      district: "Медеуский", address: "Назарбаева 240г",
      buildingClass: "B+", classKeys: ["B+"], classNote: "",
      gba: 8000, gbaLabel: "8 000 м²", gfaLabel: "800 м²/этаж",
      floors: 11, parking: "Наземный паркинг", status: "active",
      coords: { lat: 43.240, lng: 76.950 },
      shortDescription: "Бизнес-центр класса B+ на проспекте Назарбаева с развитой инфраструктурой: рестораны, кафе и магазины рядом.",
      similar: ["dial-plaza", "koktem-towers", "venus"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "8 000 м²"],
          ["Площадь этажа (GFA)", "800 м²"],
        ],
        "Здание": [
          ["Класс", "B+"],
          ["Этажность", "11 этажей"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Статус", "Введён в эксплуатацию"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "Наземный паркинг"],
          ["Охрана", "24/7"],
          ["Доступ в здание", "24/7"],
        ],
      },
      infrastructure: ["Рестораны", "Кафе", "Магазины", "Аптеки"],
    },
    {
      id: 8, slug: "time-square", photo: "/assets/objects/time-square.png", title: "БЦ Time Square",
      district: "Медеуский", address: "Самал-2",
      buildingClass: "B", classKeys: ["B"], classNote: "",
      gba: 9000, gbaLabel: "9 000 м²", gfaLabel: "600–1 000 м²/этаж",
      floors: 3, parking: "70 мест", status: "reno",
      coords: { lat: 43.232, lng: 76.946 },
      shortDescription: "Бизнес-центр класса B в микрорайоне Самал-2, проект в реновации — гибкие этажи от 600 до 1 000 м².",
      similar: ["dial-plaza", "koktem-grand", "kulan"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "9 000 м²"],
          ["Площадь этажа (GFA)", "600–1 000 м²"],
        ],
        "Здание": [
          ["Класс", "B"],
          ["Этажность", "3 этажа"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Статус", "Проект в реновации"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "70 мест"],
          ["Охрана", "24/7"],
        ],
      },
      infrastructure: ["Кафе", "Магазины", "Рестораны"],
    },
    {
      id: 9, slug: "nurly-tau", photo: "/assets/objects/nurly-tau.jpg", title: "БЦ Нурлы-Тау",
      district: "Бостандыкский", address: "Аль-Фараби 19К",
      buildingClass: "B", classKeys: ["B"], classNote: "",
      gba: 100000, gbaLabel: "более 100 000 м²", gfaLabel: "500–3 000 м²/этаж",
      floors: 32, parking: "Наземный/подземный паркинг", status: "active",
      coords: { lat: 43.218, lng: 76.928 },
      shortDescription: "Один из крупнейших деловых комплексов Алматы на Аль-Фараби: 32 этажа, гибкие площади от 500 до 3 000 м² и развитая инфраструктура.",
      similar: ["koktem-grand", "venus", "time-square"],
      planning: "Open space · Кабинеты",
      characteristics: {
        "Площади": [
          ["Общая площадь (GBA)", "более 100 000 м²"],
          ["Площадь этажа (GFA)", "500–3 000 м²"],
        ],
        "Здание": [
          ["Класс", "B"],
          ["Этажность", "32 этажа"],
          ["Планировка", "Open space · Кабинеты"],
          ["Лифты", "В наличии"],
          ["Статус", "Введён в эксплуатацию"],
        ],
        "Инженерия": [
          ["Вентиляция", "Приточно-вытяжная"],
          ["Кондиционирование", "Центральное"],
        ],
        "Комфорт и доступ": [
          ["Паркинг", "Наземный/подземный паркинг"],
          ["Охрана", "24/7"],
          ["Доступ в здание", "24/7"],
        ],
      },
      infrastructure: ["Банкоматы", "Магазины", "Аптеки", "ТРЦ", "Парикмахерские"],
    },
  ];

  const objects = finalizeCatalog([
    ...EXISTING_OBJECTS,
    ...buildExtraObjects(EXISTING_OBJECTS, MAP_BOUNDS, STATUS),
  ]);

  // --- Filter option helpers (only real values) ---
  const districts = [...new Set(objects.map(o => o.district))];           // Медеуский, Алмалинский, Бостандыкский
  const classes = ["A", "B+", "B"];                                       // canonical filter classes
  const areaRanges = [
    { id: "lt5",    label: "до 5 000 м²",        test: g => g < 5000 },
    { id: "5to10",  label: "5 000 – 10 000 м²",  test: g => g >= 5000 && g < 10000 },
    { id: "10to50", label: "10 000 – 50 000 м²", test: g => g >= 10000 && g < 50000 },
    { id: "gt50",   label: "более 50 000 м²",    test: g => g >= 50000 },
  ];

  function bySlug(slug) { return objects.find(o => o.slug === slug); }
  function similarFor(o) {
    return (o.similar || []).map(bySlug).filter(Boolean).slice(0, 3);
  }

export default {
  objects,
  districts,
  classes,
  areaRanges,
  bySlug,
  similarFor,
  STATUS,
  MAP_BOUNDS,
  WA_NUMBER,
  WA_TEXT,
  waLink,
  COMPANY: {
    name: "TMK Limited Properties Services",
    email: "Yerlepessov.t@tmk-limited.com",
    phoneDisplay: "+7 700 973 7138",
    waNumber: WA_NUMBER,
  },
};
