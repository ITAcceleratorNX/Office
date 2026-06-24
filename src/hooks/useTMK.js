import { useMemo } from "react";
import baseTMK from "../data.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { FORMAT_KEYS } from "../i18n/index.js";
import { formatPriceLabel } from "../lib/pricing.js";

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
};

const infraFallback = {
  pharmacy: { ru: "Аптеки", en: "Pharmacies", kk: "Дәріхана", zh: "药店" },
  hospital: { ru: "Больница", en: "Hospital", kk: "Аурухана", zh: "医院" },
  park: { ru: "Парк", en: "Park", kk: "Саябақ", zh: "公园" },
  shops: { ru: "Магазины", en: "Shops", kk: "Дүкендер", zh: "商店" },
  fitness: { ru: "Фитнес", en: "Fitness", kk: "Фитнес", zh: "健身" },
  restaurants: { ru: "Рестораны", en: "Restaurants", kk: "Мейрамханалар", zh: "餐厅" },
  restaurant: { ru: "Ресторан", en: "Restaurant", kk: "Мейрамхана", zh: "餐厅" },
  cinema: { ru: "Кинотеатр", en: "Cinema", kk: "Кинотеатр", zh: "电影院" },
  cafe: { ru: "Кафе", en: "Café", kk: "Кафе", zh: "咖啡厅" },
  coffee: { ru: "Кофейня", en: "Coffee shop", kk: "Кофехана", zh: "咖啡店" },
  atm: { ru: "Банкоматы", en: "ATMs", kk: "Банкоматтар", zh: "ATM" },
  hotel: { ru: "Отель", en: "Hotel", kk: "Қонақ үй", zh: "酒店" },
  supermarket: { ru: "Супермаркет", en: "Supermarket", kk: "Супермаркет", zh: "超市" },
  mall: { ru: "ТРЦ", en: "Mall", kk: "Сауда орталығы", zh: "购物中心" },
};

function translateInfra(item, lang) {
  const key = INFRA_KEYS[item];
  if (key && infraFallback[key]) return infraFallback[key][lang] || item;
  return item;
}

function localizeCharacteristics(chars, t, statusKey) {
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
    out[title] = rows.map(([k, v]) => {
      let val = v;
      if (k === "Статус") val = t(`status.${statusKey}`);
      if (k === "Лифты") {
        val = v === "В наличии" ? t("object.liftsYes") : v === "Нет" ? t("object.liftsNo") : v;
      }
      if (k === "Этажность" && typeof v === "string") {
        const m = v.match(/^(\d+)/);
        if (m) val = t("object.floorsCount", { n: m[1] });
      }
      return [mapField[k] || k, val];
    });
  }
  return out;
}

function localizeObject(o, t, lang) {
  const gbaPart = o.gbaLabel ? t("object.gbaPart", { gba: o.gbaLabel }) : "";
  const gfaPart = o.gfaLabel ? t("object.gfaPart", { gfa: o.gfaLabel.replace(/\s*м²\/этаж/, "").replace(" м²/этаж", "") }) : "";
  const plan = o.planning === "Open space · Кабинеты" ? t("object.defaultPlan") : o.planning;

  return {
    ...o,
    shortDescription: t("object.shortDesc", {
      class: o.buildingClass,
      district: o.district,
      address: o.address,
      gba: gbaPart,
      gfa: gfaPart,
      plan,
    }),
    priceLabel: formatPriceLabel(o.priceFrom, t),
    planning: plan,
    characteristics: localizeCharacteristics(o.characteristics, t, o.status),
    infrastructure: o.infrastructure?.map((item) => translateInfra(item, lang)),
  };
}

export function useTMK() {
  const { t, lang } = useI18n();

  return useMemo(() => {
    const officeFormats = FORMAT_KEYS.map((key) => ({
      key,
      label: t(`formats.${key}`),
    }));

    const areaRanges = baseTMK.areaRanges.map((r) => ({
      ...r,
      label: t(`areaRanges.${r.id}`),
    }));

    const STATUS = Object.fromEntries(
      Object.entries(baseTMK.STATUS).map(([k, v]) => [k, { ...v, label: t(`status.${k}`) }]),
    );

    const WA_TEXT = {
      general: t("wa.general"),
      card: (name) => t("wa.card", { name }),
      object: (name) => t("wa.object", { name }),
    };

    const objects = baseTMK.objects.map((o) => localizeObject(o, t, lang));

    const bySlug = (slug) => objects.find((o) => o.slug === slug);
    const similarFor = (o) => (o.similar || []).map(bySlug).filter(Boolean).slice(0, 3);

    return {
      ...baseTMK,
      objects,
      officeFormats,
      areaRanges,
      STATUS,
      WA_TEXT,
      bySlug,
      similarFor,
      waLink: baseTMK.waLink,
    };
  }, [t, lang]);
}
