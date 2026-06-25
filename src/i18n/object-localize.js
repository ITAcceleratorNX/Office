/** Stable district keys (filter values stay Russian in data.js). */
import { localizeAddress } from "./addresses.js";
export const DISTRICT_KEYS = {
  "Медеуский": "medeu",
  "Бостандыкский": "bostandyk",
  "Ауэзовский": "auezov",
  "Алмалинский": "almaly",
  "Турксибский": "turksib",
};

const INFRA_KEYS = {
  "Аптеки": "pharmacy",
  "Больница": "hospital",
  "Парк": "park",
  "Магазины": "shops",
  "Фитнес": "fitness",
  "Рестораны": "restaurants",
  "Ресторан": "restaurant",
  "Кинотеатр": "cinema",
  "Кафе": "cafe",
  "Кофейня": "coffee",
  "Банкоматы": "atm",
  "Отель": "hotel",
  "Супермаркет": "supermarket",
  "ТРЦ": "mall",
  "Ателье": "atelier",
  "Минимаркет": "minimarket",
  "Парикмахерские": "hairdresser",
};

const VENTILATION_KEYS = {
  "Естественная": "natural",
  "Приточно-вытяжная": "supplyExhaust",
  "Естественная / приточно-вытяжная": "naturalSupplyExhaust",
  "Приточно-вытяжная / естественная": "supplyExhaustNatural",
};

const CONDITIONING_KEYS = {
  "Местное": "local",
  "Центральное": "central",
  "Местное и центральное": "localAndCentral",
  "Центральное / местное": "centralLocal",
  "Местное / центральное": "localCentral",
};

const PARKING_KEYS = {
  "Подземный": "underground",
  "Нет": "none",
  "Наземный": "surface",
  "Городской": "urban",
  "Наземный паркинг": "surfaceLot",
  "Наземный/подземный паркинг": "surfaceUnderground",
};

const PLANNING_KEYS = {
  "Open space · Кабинеты": "default",
  "Кабинеты · Open space · Склады": "cabinetsOpenWarehouse",
};

export function districtLabel(district, t) {
  const key = DISTRICT_KEYS[district];
  return key ? t(`districts.${key}`) : district;
}

export function translateInfra(item, t) {
  const key = INFRA_KEYS[item];
  if (key) {
    const val = t(`infra.${key}`);
    if (val !== `infra.${key}`) return val;
  }
  return item;
}

function translateParking(value, t) {
  if (!value) return value;
  if (PARKING_KEYS[value]) return t(`specValues.parking.${PARKING_KEYS[value]}`);

  const more = value.match(/^Более\s+([\d\s]+)\s*мест/i);
  if (more) return t("specValues.parking.moreThan", { n: more[1].trim() });

  const plus = value.match(/^([\d\s]+)\+\s*мест/i);
  if (plus) return t("specValues.parking.spacesPlus", { n: plus[1].trim() });

  const spaces = value.match(/^([\d\s]+)\s*мест/i);
  if (spaces) return t("specValues.parking.spaces", { n: spaces[1].trim() });

  return value;
}

function translateVentilation(value, t) {
  const key = VENTILATION_KEYS[value];
  return key ? t(`specValues.ventilation.${key}`) : value;
}

function translateConditioning(value, t) {
  const key = CONDITIONING_KEYS[value];
  return key ? t(`specValues.conditioning.${key}`) : value;
}

function translatePlanning(value, t) {
  const key = PLANNING_KEYS[value];
  if (key === "default") return t("object.defaultPlan");
  if (key) return t(`specValues.planning.${key}`);
  return value;
}

export function localizeGbaLabel(label, t) {
  if (!label) return label;
  const range = label.match(/^от\s+([\d\s]+)\s+до\s+([\d\s]+)\s*м²$/i);
  if (range) {
    return t("object.gbaRange", { from: range[1].trim(), to: range[2].trim() });
  }
  const more = label.match(/^более\s+([\d\s]+)\s*м²$/i);
  if (more) return t("object.gbaMoreThan", { n: more[1].trim() });
  return label.replace(/\s*м²/g, ` ${t("common.sqm")}`);
}

export function localizeGfaArea(gfa, t) {
  if (gfa == null) return null;
  const n = Number(gfa);
  const formatted = Number.isFinite(n)
    ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : String(gfa);
  return t("object.gfaArea", { gfa: formatted });
}

function translateCharValue(fieldKey, value, t, statusKey) {
  if (fieldKey === "Статус") return t(`status.${statusKey}`);
  if (fieldKey === "Лифты") {
    if (value === "В наличии") return t("object.liftsYes");
    if (value === "Нет") return t("object.liftsNo");
    return value;
  }
  if (fieldKey === "Этажность" && typeof value === "string") {
    const m = value.match(/^(\d+)/);
    if (m) return t("object.floorsCount", { n: m[1] });
  }
  if (fieldKey === "Вентиляция") return translateVentilation(value, t);
  if (fieldKey === "Кондиционирование") return translateConditioning(value, t);
  if (fieldKey === "Паркинг") return translateParking(value, t);
  if (fieldKey === "Планировка") return translatePlanning(value, t);
  if (fieldKey === "Общая площадь (GBA)") return localizeGbaLabel(value, t);
  if (fieldKey === "Площадь этажа (GFA)" && typeof value === "string") {
    const m = value.match(/^([\d\s]+)/);
    if (m) return `${m[1].trim()} ${t("common.sqm")}`;
  }
  return value;
}

export function localizeCharacteristics(chars, t, statusKey) {
  const mapGroup = {
    "Площади": t("object.charGroups.areas"),
    "Здание": t("object.charGroups.building"),
    "Инженерия": t("object.charGroups.engineering"),
    "Комфорт и доступ": t("object.charGroups.comfort"),
  };
  const mapField = {
    "Общая площадь (GBA)": t("object.charFields.gba"),
    "Площадь этажа (GFA)": t("object.charFields.gfa"),
    "Класс": t("object.charFields.class"),
    "Этажность": t("object.charFields.floors"),
    "Планировка": t("object.charFields.planning"),
    "Лифты": t("object.charFields.lifts"),
    "Статус": t("object.charFields.status"),
    "Вентиляция": t("object.charFields.ventilation"),
    "Кондиционирование": t("object.charFields.conditioning"),
    "Паркинг": t("object.charFields.parking"),
    "Охрана": t("object.charFields.security"),
    "Доступ в здание": t("object.charFields.access"),
  };

  const out = {};
  for (const [group, rows] of Object.entries(chars)) {
    const title = mapGroup[group] || group;
    out[title] = rows.map(([k, v]) => [
      mapField[k] || k,
      translateCharValue(k, v, t, statusKey),
    ]);
  }
  return out;
}

export function localizeObject(o, t, lang) {
  const districtLabelText = districtLabel(o.district, t);
  const address = localizeAddress(o.slug, o.address, lang);
  const gbaLabel = localizeGbaLabel(o.gbaLabel, t);
  const gfaFormatted = o.gfa != null
    ? o.gfa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : null;
  const gfaArea = gfaFormatted ? localizeGfaArea(o.gfa, t) : null;
  const plan = translatePlanning(o.planning, t);

  return {
    ...o,
    districtLabel: districtLabelText,
    address,
    gbaLabel,
    gfaDisplay: gfaArea,
    gfaLabel: gfaFormatted ? t("object.gfaPerFloor", { gfa: gfaFormatted }) : o.gfaLabel,
    shortDescription: t("object.shortDesc", {
      class: o.buildingClass,
      district: districtLabelText,
      address,
      gba: gbaLabel ? t("object.gbaPart", { gba: gbaLabel }) : "",
      gfa: gfaArea ? t("object.gfaPart", { gfa: gfaArea }) : "",
      plan,
    }),
    planning: plan,
    characteristics: localizeCharacteristics(o.characteristics, t, o.status),
    infrastructure: o.infrastructure?.map((item) => translateInfra(item, t)),
  };
}
