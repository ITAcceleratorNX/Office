import { useMemo } from "react";
import baseTMK from "../data.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { FORMAT_KEYS } from "../i18n/index.js";
import { DISTRICT_KEYS, districtLabel, localizeObject } from "../i18n/object-localize.js";
import { formatPriceLabel } from "../lib/pricing.js";

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

    const objects = baseTMK.objects.map((o) => {
      const localized = localizeObject(o, t, lang);
      return {
        ...localized,
        priceLabel: formatPriceLabel(o.priceFrom, t),
      };
    });

    const bySlug = (slug) => objects.find((o) => o.slug === slug);
    const similarFor = (o) => (o.similar || []).map(bySlug).filter(Boolean).slice(0, 3);

    const districts = baseTMK.districts.map((d) => ({
      value: d,
      label: districtLabel(d, t),
    }));

    return {
      ...baseTMK,
      objects,
      districts,
      districtLabel: (d) => districtLabel(d, t),
      officeFormats,
      areaRanges,
      STATUS,
      WA_TEXT,
      bySlug,
      similarFor,
      waLink: baseTMK.waLink,
      DISTRICT_KEYS,
    };
  }, [t, lang]);
}
