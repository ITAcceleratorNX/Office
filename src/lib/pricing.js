export function formatPriceLabel(priceFrom, t) {
  if (priceFrom == null) return null;
  const n = Number(priceFrom);
  if (!Number.isFinite(n) || n <= 0) return null;
  const formatted = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  if (!t) return `от ${formatted} тг/м² · мес`;
  return t("common.priceFrom", {
    price: formatted,
    currency: t("common.currency"),
    perMonth: t("common.perMonth"),
  });
}

export const DEFAULT_PRICE_BY_CLASS = {
  A: 9500,
  "B+": 7500,
  B: 5500,
};

export function resolvePriceFrom(buildingClass, explicit) {
  if (explicit != null && explicit > 0) return explicit;
  return DEFAULT_PRICE_BY_CLASS[buildingClass] ?? 5000;
}
