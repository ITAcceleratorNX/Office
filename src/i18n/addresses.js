/** Localized street addresses keyed by object slug. */
const ADDRESSES = {
  "abylai-khan-plaza": {
    ru: "Абылай хана 53",
    en: "Abylai Khan 53",
    kk: "Абылай хана 53",
    zh: "阿拜汗大街 53号",
  },
  "bnc-plaza": {
    ru: "Тимирязева 26",
    en: "Timiryazeva 26",
    kk: "Тимирязева 26",
    zh: "季米里亚泽娃大街 26号",
  },
  "almaty-plaza": {
    ru: "Наурызбай батыра 17А",
    en: "Nauryzbai Batyr 17A",
    kk: "Наурызбай батыр 17А",
    zh: "瑙尔兹拜·巴特尔大街 17A号",
  },
  "almaty-residence": {
    ru: "Ауэзова 60",
    en: "Auezova 60",
    kk: "Әуезов 60",
    zh: "阿乌埃佐娃大街 60号",
  },
  "capital-tower": {
    ru: "Абиша Кекильбайулы 34",
    en: "Abisha Kekilbayuly 34",
    kk: "Әбіш Кекілбайұлы 34",
    zh: "阿比沙·凯基尔巴尤雷大街 34号",
  },
  "esentai-tower": {
    ru: "Аль-Фараби 77/7",
    en: "Al-Farabi 77/7",
    kk: "Әл-Фараби 77/7",
    zh: "法拉比大街 77/7号",
  },
  baykonyr: {
    ru: "Абая 42",
    en: "Abay 42",
    kk: "Абай 42",
    zh: "阿拜大街 42号",
  },
  "ken-dala": {
    ru: "Достык 38",
    en: "Dostyk 38",
    kk: "Достық 38",
    zh: "多斯特克大街 38号",
  },
  "esentai-city": {
    ru: "Аль-Фараби 128/4",
    en: "Al-Farabi 128/4",
    kk: "Әл-Фараби 128/4",
    zh: "法拉比大街 128/4号",
  },
  "forum-dostyk": {
    ru: "Достык 202",
    en: "Dostyk 202",
    kk: "Достық 202",
    zh: "多斯特克大街 202号",
  },
  premium: {
    ru: "Наурызбай батыра 31",
    en: "Nauryzbai Batyr 31",
    kk: "Наурызбай батыр 31",
    zh: "瑙尔兹拜·巴特尔大街 31号",
  },
  stanitsa: {
    ru: "Чаплина 71",
    en: "Chaplina 71",
    kk: "Чаплин 71",
    zh: "恰普林大街 71号",
  },
  "avenue-310": {
    ru: "Достык 310/1",
    en: "Dostyk 310/1",
    kk: "Достық 310/1",
    zh: "多斯特克大街 310/1号",
  },
  "avenue-city": {
    ru: "Абая 68",
    en: "Abay 68",
    kk: "Абай 68",
    zh: "阿拜大街 68号",
  },
  "tole-bi-101": {
    ru: "Толе би 101",
    en: "Tole Bi 101",
    kk: "Төле би 101",
    zh: "托列比大街 101号",
  },
  "green-tower": {
    ru: "Достык 192/2",
    en: "Dostyk 192/2",
    kk: "Достық 192/2",
    zh: "多斯特克大街 192/2号",
  },
  triumph: {
    ru: "Достык 192",
    en: "Dostyk 192",
    kk: "Достық 192",
    zh: "多斯特克大街 192号",
  },
  "koktem-towers": {
    ru: "Достык 180",
    en: "Dostyk 180",
    kk: "Достық 180",
    zh: "多斯特克大街 180号",
  },
  "koktem-grand": {
    ru: "Достык 210",
    en: "Dostyk 210",
    kk: "Достық 210",
    zh: "多斯特克大街 210号",
  },
  venus: {
    ru: "Елебекова 10",
    en: "Elebekova 10",
    kk: "Елебекова 10",
    zh: "叶列别科娃大街 10号",
  },
  "dial-plaza": {
    ru: "Сейфулина 541",
    en: "Seyfulina 541",
    kk: "Сейфуллин 541",
    zh: "赛富林大街 541号",
  },
  "teniz-towers": {
    ru: "Назарбаева 240г",
    en: "Nazarbayev Ave 240g",
    kk: "Назарбаев даңғылы 240г",
    zh: "纳扎尔巴耶夫大街 240g号",
  },
  "time-square": {
    ru: "Самал-2",
    en: "Samal-2",
    kk: "Самал-2",
    zh: "萨马尔-2区",
  },
  "nurly-tau": {
    ru: "Аль-Фараби 19К",
    en: "Al-Farabi 19K",
    kk: "Әл-Фараби 19К",
    zh: "法拉比大街 19K号",
  },
  sat: {
    ru: "Улица Манаса, 32а",
    en: "Manas St 32a",
    kk: "Манас көшесі, 32а",
    zh: "玛纳斯街 32a号",
  },
  "old-square": {
    ru: "Панфилова 98",
    en: "Panfilova 98",
    kk: "Панфилов 98",
    zh: "潘菲洛娃大街 98号",
  },
  q: {
    ru: "Кабанбай батыр проспект, 15а",
    en: "Kabanbay Batyr Ave 15a",
    kk: "Қабанбай батыр даңғылы, 15а",
    zh: "卡班拜·巴特尔大街 15a号",
  },
  prime: {
    ru: "проспект Назарбаева, 100г",
    en: "Nazarbayev Ave 100g",
    kk: "Назарбаев даңғылы, 100г",
    zh: "纳扎尔巴耶夫大街 100g号",
  },
  "alatau-grand": {
    ru: "Тимирязева 28",
    en: "Timiryazeva 28",
    kk: "Тимирязева 28",
    zh: "季米里亚泽娃大街 28号",
  },
  "d-43": {
    ru: "Достык 43",
    en: "Dostyk 43",
    kk: "Достық 43",
    zh: "多斯特克大街 43号",
  },
  "viia-tower": {
    ru: "Жумалиева 86",
    en: "Zhumaliyeva 86",
    kk: "Жұмалиев 86",
    zh: "朱马利耶娃大街 86号",
  },
  kulan: {
    ru: "Достык 188",
    en: "Dostyk 188",
    kk: "Достық 188",
    zh: "多斯特克大街 188号",
  },
  fortis: {
    ru: "Ходжанова 2/2",
    en: "Khojanova 2/2",
    kk: "Хожанов 2/2",
    zh: "霍贾诺夫大街 2/2号",
  },
  nova: {
    ru: "Жандосова 136",
    en: "Zhandosova 136",
    kk: "Жандосов 136",
    zh: "詹多索娃大街 136号",
  },
  "han-tengri": {
    ru: "Кажымукана 22/5",
    en: "Kazymukana 22/5",
    kk: "Қажымұқан 22/5",
    zh: "卡日穆卡纳大街 22/5号",
  },
  "d-160": {
    ru: "Достык 160",
    en: "Dostyk 160",
    kk: "Достық 160",
    zh: "多斯特克大街 160号",
  },
  avrora: {
    ru: "Ходжанова 79",
    en: "Khojanova 79",
    kk: "Хожанов 79",
    zh: "霍贾诺夫大街 79号",
  },
  rams: {
    ru: "Рубинштейна 48",
    en: "Rubinstein 48",
    kk: "Рубинштейн 48",
    zh: "鲁宾斯坦大街 48号",
  },
  "element-tower": {
    ru: "Политехническая 8",
    en: "Politekhnicheskaya 8",
    kk: "Политехникалық 8",
    zh: "理工大街 8号",
  },
  globus: {
    ru: "Абая 109 В",
    en: "Abay 109B",
    kk: "Абай 109 В",
    zh: "阿拜大街 109B号",
  },
  star: {
    ru: "Назарбаева 187Б",
    en: "Nazarbayev Ave 187B",
    kk: "Назарбаев даңғылы 187Б",
    zh: "纳扎尔巴耶夫大街 187B号",
  },
  jenis: {
    ru: "Бухар Жырау 33",
    en: "Bukhar Zhyrau 33",
    kk: "Бұхар жырау 33",
    zh: "布哈尔·日劳大街 33号",
  },
  "saba-plaza": {
    ru: "Кожамкулова 265",
    en: "Kozhamkulova 265",
    kk: "Қожамқұлова 265",
    zh: "科扎姆库洛娃大街 265号",
  },
  eurostandart: {
    ru: "Назарбаева 28/3",
    en: "Nazarbayev Ave 28/3",
    kk: "Назарбаев даңғылы 28/3",
    zh: "纳扎尔巴耶夫大街 28/3号",
  },
  "a-plaza": {
    ru: "Ахмедьярова 25а",
    en: "Ahmedyarov 25A",
    kk: "Ахмедьяров 25а",
    zh: "艾哈迈德亚罗夫大街 25A号",
  },
  "almaty-towers": {
    ru: "Байзакова 280",
    en: "Baizakova 280",
    kk: "Байзақов 280",
    zh: "拜扎科娃大街 280号",
  },
};

export function localizeAddress(slug, fallback, lang) {
  const row = slug && ADDRESSES[slug];
  if (!row) return fallback;
  return row[lang] || row.ru || fallback;
}

export default ADDRESSES;
