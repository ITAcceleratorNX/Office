const WA_NUMBER = "77009737138";
const WA_TEXT = {
  general: "Здравствуйте! Интересует аренда коммерческой недвижимости. Подскажите, пожалуйста, какие офисы доступны?",
  card: (name) => `Здравствуйте! Интересует аренда офиса в ${name}. Подскажите, пожалуйста, какие варианты доступны?`,
  object: (name) => `Здравствуйте! Интересует аренда офиса в ${name}. Хотел бы уточнить условия и доступные площади.`,
};
function waLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

const MAP_BOUNDS = { latMin: 43.205, latMax: 43.262, lngMin: 76.900, lngMax: 76.968 };

const STATUS = {
  active: { label: "Введён в эксплуатацию", tone: "status" },
  reno: { label: "Проект в реновации", tone: "reno" },
  launch: { label: "На стадии запуска", tone: "launch" },
};

const PHOTO_FILES = {
  "abylai-khan-plaza": "Abylai khan plaza.png",
  "almaty-plaza": "Almaty plaza.png",
  "almaty-residence": "Almaty Residence.png",
  "avenue-310": "Avenue 310.png",
  "avenue-city": "Avenue city.png",
  "baykonyr": "Baykonyr.png",
  "bnc-plaza": "BNC Plaza.png",
  "capital-tower": "Capital tower.png",
  "esentai-city": "Esentai city.png",
  "esentai-tower": "Esentai Tower.png",
  "forum-dostyk": "Forum.png",
  "ken-dala": "Ken Dala.png",
  "premium": "Premium.png",
  "stanitsa": "Stancia.png",
  "tole-bi-101": "Tole bi.png",
};

function fmtNum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function photoUrl(slug) {
  const file = PHOTO_FILES[slug];
  return file ? `/assets/objects/${encodeURIComponent(file)}` : undefined;
}

function liftsLabel(yes) {
  return yes ? "В наличии" : "Нет";
}

function makeObj(row) {
  const {
    slug, title, district, address, buildingClass, gba, gbaLabel, gfa, floors,
    lifts, ventilation, conditioning, parking, infrastructure, planning,
    classNote = "", similar = [], status = "active", coords = null,
  } = row;

  const classKeys = buildingClass === "A" ? ["A"] : buildingClass === "B+" ? ["B+"] : ["B"];
  const gbaLabelFinal = gbaLabel ?? (gba != null ? `${fmtNum(gba)} м²` : null);
  const gfaLabel = gfa != null ? `${fmtNum(gfa)} м²/этаж` : null;
  const plan = planning ?? "Open space · Кабинеты";
  const statusInfo = STATUS[status] || STATUS.active;

  const areaRows = [];
  if (gbaLabelFinal) areaRows.push(["Общая площадь (GBA)", gbaLabelFinal]);
  if (gfa != null) areaRows.push(["Площадь этажа (GFA)", `${fmtNum(gfa)} м²`]);

  const buildingRows = [
    ["Класс", buildingClass],
    ...(floors != null ? [["Этажность", `${floors} этажей`]] : []),
    ["Планировка", plan],
    ["Лифты", liftsLabel(lifts)],
    ["Статус", statusInfo.label],
  ];

  const shortDescription =
    `Бизнес-центр класса ${buildingClass} в ${district} районе по адресу ${address}` +
    (gbaLabelFinal ? ` — общая площадь ${gbaLabelFinal}` : "") +
    (gfaLabel ? `, этаж ${fmtNum(gfa)} м²` : "") +
    ". " + plan + ", охрана и доступ 24/7.";

  return {
    slug,
    title,
    district,
    address,
    buildingClass,
    classKeys,
    classNote,
    gba: gba ?? null,
    gbaLabel: gbaLabelFinal,
    gfaLabel,
    floors: floors ?? null,
    parking,
    status,
    photo: photoUrl(slug),
    coords,
    shortDescription,
    similar,
    planning: plan,
    characteristics: {
      ...(areaRows.length ? { "Площади": areaRows } : {}),
      "Здание": buildingRows,
      "Инженерия": [
        ["Вентиляция", ventilation],
        ["Кондиционирование", conditioning],
      ],
      "Комфорт и доступ": [
        ["Паркинг", parking],
        ["Охрана", "24/7"],
        ["Доступ в здание", "24/7"],
      ],
    },
    infrastructure,
  };
}

const RAW_OBJECTS = [
  {
    slug: "abylai-khan-plaza", title: "Abylai Khan Plaza", district: "Медеуский", address: "Абылай хана 53", coords: { lat: 43.264037, lng: 76.939834 },
    buildingClass: "A", gba: 20000, gfa: 1818, floors: 11, lifts: true,
    ventilation: "Естественная / приточно-вытяжная", conditioning: "Местное и центральное",
    parking: "Подземный", infrastructure: ["Аптеки", "Больница", "Парк", "Магазины", "Фитнес"],
    similar: ["ken-dala", "avenue-310", "forum-dostyk"],
  },
  {
    slug: "bnc-plaza", title: "BNC Plaza", district: "Бостандыкский", address: "Тимирязева 26", coords: { lat: 43.220365, lng: 76.908896 },
    buildingClass: "A", gba: 15000, gfa: 1667, floors: 9, lifts: true,
    ventilation: "Естественная / приточно-вытяжная", conditioning: "Местное и центральное",
    parking: "Нет", infrastructure: ["Аптеки", "Рестораны", "Больница", "Кинотеатр", "Магазины"],
    similar: ["esentai-tower", "esentai-city", "capital-tower"],
  },
  {
    slug: "almaty-plaza", title: "Almaty Plaza", district: "Ауэзовский", address: "Наурызбай батыра 17А", coords: { lat: 43.257408, lng: 76.926186 },
    buildingClass: "A", gba: 24000, gfa: 1846, floors: 13, lifts: true,
    ventilation: "Естественная / приточно-вытяжная", conditioning: "Местное",
    parking: "123 места", infrastructure: ["Аптеки", "Рестораны", "Больница", "Парк", "Магазины"],
    similar: ["bnc-plaza", "esentai-tower", "capital-tower"],
  },
  {
    slug: "almaty-residence", title: "Almaty Residence", district: "Алмалинский", address: "Ауэзова 60", coords: { lat: 43.245447, lng: 76.903766 },
    buildingClass: "B", gba: 15000, gfa: 1363, floors: 11, lifts: true,
    ventilation: "Естественная", conditioning: "Местное",
    parking: "100 мест", infrastructure: ["Банкоматы", "Аптеки", "Рестораны", "Кафе", "Магазины"],
    similar: ["baykonyr", "avenue-city", "premium"],
  },
  {
    slug: "capital-tower", title: "Capital Tower", district: "Бостандыкский", address: "Абиша Кекильбайулы 34", coords: { lat: 43.205345, lng: 76.890763 },
    buildingClass: "B+", gba: 21200, gfa: 1325, floors: 16, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Банкоматы", "Аптеки", "Кафе", "Магазины", "Парк"],
    similar: ["bnc-plaza", "esentai-tower", "ken-dala"],
  },
  {
    slug: "esentai-tower", title: "Esentai Tower", district: "Бостандыкский", address: "Аль-Фараби 77/7", coords: { lat: 43.219518, lng: 76.929649 },
    buildingClass: "A", gba: 53700, gfa: 1413, floors: 38, lifts: true,
    ventilation: "Приточно-вытяжная / естественная", conditioning: "Центральное / местное",
    parking: "390 мест", infrastructure: ["Отель", "Фитнес", "Ресторан", "Супермаркет", "Банкоматы", "Аптеки", "Кафе", "Магазины"],
    similar: ["esentai-city", "bnc-plaza", "almaty-plaza"],
  },
  {
    slug: "baykonyr", title: "Baykonyr", district: "Алмалинский", address: "Абая 42", coords: { lat: 43.240853, lng: 76.928447 },
    buildingClass: "B+", gba: 9900, gfa: 761, floors: 13, lifts: true,
    ventilation: "Приточно-вытяжная / естественная", conditioning: "Местное",
    parking: "70 мест", infrastructure: ["Фитнес", "Кафе", "Магазины"],
    similar: ["almaty-residence", "avenue-city", "premium"],
  },
  {
    slug: "ken-dala", title: "Ken Dala", district: "Медеуский", address: "Достык 38", coords: { lat: 43.252292, lng: 76.956850 },
    buildingClass: "B+", gba: 20000, gfa: 2223, floors: 9, lifts: true,
    ventilation: "Приточно-вытяжная / естественная", conditioning: "Местное / центральное",
    parking: "150 мест", infrastructure: ["Фитнес", "Кафе", "Магазины", "Рестораны", "Аптеки"],
    similar: ["abylai-khan-plaza", "forum-dostyk", "avenue-310"],
  },
  {
    slug: "esentai-city", title: "Esentai City", district: "Бостандыкский", address: "Аль-Фараби 128/4", coords: { lat: 43.212449, lng: 76.940942 },
    buildingClass: "A", gba: 5000, gbaLabel: "от 5 000 до 30 000 м²", gfa: 1600, lifts: false,
    ventilation: "Приточно-вытяжная / естественная", conditioning: "Центральное",
    parking: "Наземный", infrastructure: ["Магазины", "Аптеки", "ТРЦ", "Банкоматы", "Кафе", "Рестораны"],
    similar: ["esentai-tower", "bnc-plaza", "capital-tower"],
  },
  {
    slug: "forum-dostyk", title: "Форум Достык", district: "Медеуский", address: "Достык 202", coords: { lat: 43.230803, lng: 76.960440 },
    buildingClass: "B", gba: 4153, gfa: 692, floors: 6, lifts: true,
    ventilation: "Приточно-вытяжная / естественная", conditioning: "Центральное",
    parking: "12 мест", infrastructure: ["Фитнес", "Кафе", "Магазины", "Рестораны", "Аптеки", "Ателье", "Отель", "Минимаркет"],
    similar: ["ken-dala", "abylai-khan-plaza", "avenue-310"],
  },
  {
    slug: "premium", title: "Premium", district: "Алмалинский", address: "Наурызбай батыра 31", coords: { lat: 43.260306, lng: 76.934964 },
    buildingClass: "B", gba: 13000, gfa: 1300, floors: 10, lifts: true,
    ventilation: "Приточно-вытяжная / естественная", conditioning: "Центральное / местное",
    parking: "20 мест", infrastructure: ["Кафе", "Магазины"],
    similar: ["almaty-residence", "baykonyr", "tole-bi-101"],
  },
  {
    slug: "stanitsa", title: "Станица", district: "Турксибский", address: "Чаплина 71", coords: { lat: 43.285067, lng: 76.983080 },
    buildingClass: "B", gba: 25000, gfa: 3125, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное / местное",
    parking: "100+ мест", planning: "Кабинеты · Open space · Склады",
    infrastructure: ["Кафе", "Магазины"],
    similar: ["tole-bi-101", "almaty-residence", "premium"],
  },
  {
    slug: "avenue-310", title: "Avenue 310", district: "Медеуский", address: "Достык 310/1", coords: { lat: 43.210144, lng: 76.969262 },
    buildingClass: "B", gba: 2500, gfa: 500, floors: 5, lifts: true,
    ventilation: "Естественная", conditioning: "Местное",
    parking: "Наземный", infrastructure: ["Кафе", "Магазины", "Аптеки", "Больница", "Банкоматы"],
    similar: ["forum-dostyk", "ken-dala", "abylai-khan-plaza"],
  },
  {
    slug: "avenue-city", title: "Avenue City", district: "Алмалинский", address: "Абая 68", coords: { lat: 43.236954, lng: 76.905823 },
    buildingClass: "B", gba: 5412, gfa: 1082, floors: 5, lifts: false,
    ventilation: "Приточно-вытяжная", conditioning: "Местное",
    parking: "Городской", infrastructure: ["Кафе", "Магазины", "Аптеки", "Больница", "Банкоматы"],
    similar: ["baykonyr", "almaty-residence", "premium"],
  },
  {
    slug: "tole-bi-101", title: "Толе Би 101", district: "Алмалинский", address: "Толе би 101", coords: { lat: 43.253963, lng: 76.925164 },
    buildingClass: "B", gba: 22000, gfa: 2200, floors: 10, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Кафе", "Магазины", "Аптеки", "Парк"],
    similar: ["stanitsa", "premium", "almaty-residence"],
  },
];

const objects = RAW_OBJECTS.map((row, i) => ({ ...makeObj(row), id: i + 1 }));

const districts = [...new Set(objects.map((o) => o.district))];
const classes = ["A", "B+", "B"];
const areaRanges = [
  { id: "lt5", label: "до 5 000 м²", test: (g) => g < 5000 },
  { id: "5to10", label: "5 000 – 10 000 м²", test: (g) => g >= 5000 && g < 10000 },
  { id: "10to50", label: "10 000 – 50 000 м²", test: (g) => g >= 10000 && g < 50000 },
  { id: "gt50", label: "более 50 000 м²", test: (g) => g >= 50000 },
];

function bySlug(slug) { return objects.find((o) => o.slug === slug); }
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
