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
    photo: row.photo ?? photoUrl(slug),
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
    photo: "/assets/objects/Abylai%20khan%20plaza.png",
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
    photo: "/assets/objects/Almaty%20plaza.png",
    buildingClass: "A", gba: 24000, gfa: 1846, floors: 13, lifts: true,
    ventilation: "Естественная / приточно-вытяжная", conditioning: "Местное",
    parking: "123 места", infrastructure: ["Аптеки", "Рестораны", "Больница", "Парк", "Магазины"],
    similar: ["bnc-plaza", "esentai-tower", "capital-tower"],
  },
  {
    slug: "almaty-residence", title: "Almaty Residence", district: "Алмалинский", address: "Ауэзова 60", coords: { lat: 43.245447, lng: 76.903766 },
    photo: "/assets/objects/Almaty%20Residence.png",
    buildingClass: "B", gba: 15000, gfa: 1363, floors: 11, lifts: true,
    ventilation: "Естественная", conditioning: "Местное",
    parking: "100 мест", infrastructure: ["Банкоматы", "Аптеки", "Рестораны", "Кафе", "Магазины"],
    similar: ["baykonyr", "avenue-city", "premium"],
  },
  {
    slug: "capital-tower", title: "Capital Tower", district: "Бостандыкский", address: "Абиша Кекильбайулы 34", coords: { lat: 43.205345, lng: 76.890763 },
    photo: "/assets/objects/Capital%20tower.png",
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
  {
    slug: "green-tower", title: "Green Tower", district: "Медеуский", address: "Достык 192/2", coords: { lat: 43.231631, lng: 76.960461 },
    photo: "/assets/objects/green-tower.jpg",
    buildingClass: "A", gba: 11000, gbaLabel: "11 000 м²", gfa: 900, floors: 12, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "120 мест", infrastructure: ["Кофейня","Магазины","Аптеки","ТРЦ"],
    similar: ["triumph","koktem-towers","dial-plaza"],
  },
  {
    slug: "triumph", title: "Triumph", district: "Медеуский", address: "Достык 192", coords: { lat: 43.233951, lng: 76.961488 },
    photo: "/assets/objects/triumph.jpg",
    buildingClass: "B+", gba: 2500, gbaLabel: "2 500 м²", gfa: 313, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "120 мест", infrastructure: ["Кофейня","Магазины","Аптеки","ТРЦ"],
    similar: ["koktem-towers","green-tower","venus"],
  },
  {
    slug: "koktem-towers", title: "Koktem-Towers", district: "Медеуский", address: "Достык 180", coords: { lat: 43.232442, lng: 76.959689 },
    photo: "/assets/objects/koktem-towers.jpg",
    buildingClass: "B+", gba: 5000, gbaLabel: "5 000 м²", gfa: 400, floors: 9, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "110 мест", infrastructure: ["Кофейня","Магазины","Аптеки","ТРЦ"],
    similar: ["triumph","koktem-grand","green-tower"],
  },
  {
    slug: "koktem-grand", title: "Koktem Grand", district: "Медеуский", address: "Достык 210", coords: { lat: 43.230022, lng: 76.960874 },
    photo: "/assets/objects/koktem-grand.jpg",
    buildingClass: "B", gba: 56400, gbaLabel: "56 400 м²", gfa: 1300, floors: 14, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "Более 300 мест", infrastructure: ["Кофейня","Магазины","Аптеки","ТРЦ"],
    similar: ["koktem-towers","venus","nurly-tau"],
  },
  {
    slug: "venus", title: "VENUS", district: "Медеуский", address: "Елебекова 10", coords: { lat: 43.228457, lng: 76.963440 },
    photo: "/assets/objects/venus.jpg",
    buildingClass: "B+", gba: 22000, gbaLabel: "22 000 м²", gfa: 700, floors: 3, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "Более 50 мест", infrastructure: ["Кофейня","Магазины","Аптеки","ТРЦ"],
    similar: ["koktem-grand","triumph","teniz-towers"],
  },
  {
    slug: "dial-plaza", title: "Dial Plaza", district: "Алмалинский", address: "Сейфулина 541", coords: { lat: 43.254600, lng: 76.932279 },
    photo: "/assets/objects/dial-plaza.jpg",
    buildingClass: "A", gba: 7400, gbaLabel: "7 400 м²", gfa: 740, floors: 10, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "Наземный паркинг", infrastructure: ["Банкоматы","Магазины","Аптеки"],
    similar: ["green-tower","teniz-towers","time-square"],
  },
  {
    slug: "teniz-towers", title: "Teniz Towers", district: "Медеуский", address: "Назарбаева 240г", coords: { lat: 43.228744, lng: 76.951012 },
    photo: "/assets/objects/teniz-towers.jpg",
    buildingClass: "B+", gba: 8000, gbaLabel: "8 000 м²", gfa: 800, floors: 11, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "Наземный паркинг", infrastructure: ["Рестораны","Кафе","Магазины","Аптеки"],
    similar: ["dial-plaza","koktem-towers","venus"],
  },
  {
    slug: "time-square", title: "Time Square", district: "Медеуский", address: "Самал-2", coords: { lat: 43.227780, lng: 76.956285 },
    photo: "/assets/objects/time-square.png",
    buildingClass: "B", gba: 9000, gbaLabel: "9 000 м²", gfa: 1000, floors: 3, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "70 мест", infrastructure: ["Кафе","Магазины","Рестораны"],
    similar: ["dial-plaza","koktem-grand","kulan"],
  },
  {
    slug: "nurly-tau", title: "Нурлы-Тау", district: "Бостандыкский", address: "Аль-Фараби 19К", coords: { lat: 43.229347, lng: 76.945641 },
    photo: "/assets/objects/nurly-tau.jpg",
    buildingClass: "B", gba: 100000, gbaLabel: "более 100 000 м²", gfa: 3000, floors: 32, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "Наземный/подземный паркинг", infrastructure: ["Банкоматы","Магазины","Аптеки","ТРЦ","Парикмахерские"],
    similar: ["koktem-grand","venus","time-square"],
  },
  {
    slug: "sat", title: "SAT", district: "Бостандыкский", address: "Улица Манаса, 32а", coords: { lat: 43.236460, lng: 76.909496 },
    photo: "/assets/objects/SAT.png",
    buildingClass: "B", gba: 14500, gbaLabel: "14 500 м²", gfa: 1450, floors: 10, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "80 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "old-square", title: "Old Square", district: "Алмалинский", address: "Панфилова 98", coords: { lat: 43.257325, lng: 76.945044 },
    photo: "/assets/objects/Old%20Square.png",
    buildingClass: "B", gba: 22000, gbaLabel: "22 000 м²", gfa: 1571, floors: 14, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "120 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "q", title: "Q", district: "Бостандыкский", address: "Кабанбай батыр проспект, 15а", coords: { lat: 43.231324, lng: 76.943644 },
    photo: "/assets/objects/Q.png",
    buildingClass: "A", gba: 16762, gbaLabel: "16 762 м²", gfa: 1676, floors: 10, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "80 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "prime", title: "Prime", district: "Медеуский", address: "проспект Назарбаева, 100г", coords: { lat: 43.257699, lng: 76.946655 },
    photo: "/assets/objects/Prime.png",
    buildingClass: "B+", gba: 8686, gbaLabel: "8 686 м²", gfa: 1086, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "alatau-grand", title: "Алатау Гранд", district: "Бостандыкский", address: "Тимирязева 28", coords: { lat: 43.229684, lng: 76.932996 },
    photo: "/assets/objects/Alatau%20Grand.png",
    buildingClass: "B", gba: 28000, gbaLabel: "28 000 м²", gfa: 2000, floors: 14, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "120 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "d-43", title: "D-43", district: "Медеуский", address: "Достык 43", coords: { lat: 43.251422, lng: 76.955389 },
    photo: "/assets/objects/D-43.png",
    buildingClass: "B", gba: 6552, gbaLabel: "6 552 м²", gfa: 819, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "viia-tower", title: "Viia Tower", district: "Алмалинский", address: "Жумалиева 86", coords: { lat: 43.253566, lng: 76.913410 },
    photo: "/assets/objects/Viia%20tower.png",
    buildingClass: "B", gba: 4626, gbaLabel: "4 626 м²", gfa: 771, floors: 6, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "30 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "kulan", title: "Kulan", district: "Медеуский", address: "Достык 188", coords: { lat: 43.231956, lng: 76.960021 },
    photo: "/assets/objects/Kulan.png",
    buildingClass: "B", gba: 5500, gbaLabel: "5 500 м²", gfa: 688, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "fortis", title: "Fortis", district: "Бостандыкский", address: "Ходжанова 2/2", coords: { lat: 43.210326, lng: 76.907815 },
    photo: "/assets/objects/Fortis.png",
    buildingClass: "B", gba: 11000, gbaLabel: "11 000 м²", gfa: 1100, floors: 10, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "80 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "nova", title: "Nova", district: "Ауэзовский", address: "Жандосова 136", coords: { lat: 43.215341, lng: 76.874406 },
    photo: "/assets/objects/Nova.png",
    buildingClass: "B", gba: 2500, gbaLabel: "2 500 м²", gfa: 417, floors: 6, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "30 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "han-tengri", title: "Хан-Тенгри", district: "Медеуский", address: "Кажымукана 22/5", coords: { lat: 43.223815, lng: 76.956840 },
    photo: "/assets/objects/Khan%20Tengri.jpg",
    buildingClass: "B", gba: 15000, gbaLabel: "15 000 м²", gfa: 1500, floors: 10, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "80 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "d-160", title: "D-160", district: "Медеуский", address: "Достык 160", coords: { lat: 43.233830, lng: 76.959079 },
    photo: "/assets/objects/D-160.png",
    buildingClass: "B", gba: 6500, gbaLabel: "6 500 м²", gfa: 813, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "avrora", title: "Аврора", district: "Бостандыкский", address: "Ходжанова 79", coords: { lat: 43.209008, lng: 76.912468 },
    photo: "/assets/objects/Avrora.png",
    buildingClass: "B", gba: 7500, gbaLabel: "7 500 м²", gfa: 938, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "rams", title: "Рубенштейна 48", district: "Алмалинский", address: "Рубинштейна 48", coords: { lat: 43.222195, lng: 76.967460 },
    photo: "/assets/objects/Rubenshtein%2048.png",
    buildingClass: "B", gba: null, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "Наземный паркинг", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "element-tower", title: "Element Tower", district: "Ауэзовский", address: "Политехническая 8", coords: { lat: 43.235605, lng: 76.935531 },
    photo: "/assets/objects/Element%20tower.png",
    buildingClass: "A", gba: 7800, gbaLabel: "7 800 м²", gfa: 975, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "globus", title: "Globus", district: "Алмалинский", address: "Абая 109 В", coords: { lat: 43.240383, lng: 76.905047 },
    photo: "/assets/objects/Globus.png",
    buildingClass: "B", gba: 15000, gbaLabel: "15 000 м²", gfa: 1500, floors: 10, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "80 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
  },
  {
    slug: "star", title: "Star", district: "Бостандыкский", address: "Назарбаева 187Б", coords: { lat: 43.240688, lng: 76.947228 },
    photo: "/assets/objects/Star.png",
    buildingClass: "B", gba: 9000, gbaLabel: "9 000 м²", gfa: 1125, floors: 8, lifts: true,
    ventilation: "Приточно-вытяжная", conditioning: "Центральное",
    parking: "50 мест", infrastructure: ["Магазины","Кафе","Аптеки"],
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
