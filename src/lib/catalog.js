import baseTMK from "../data.js";

export const CATALOG_PAGE_SIZE = 9;

export function filterObjects(objects, { q = "", district = "", cls = "", area = "" } = {}) {
  return objects.filter((o) => {
    if (q && !o.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (district && o.district !== district) return false;
    if (cls && !o.classKeys.includes(cls)) return false;
    if (area) {
      const range = baseTMK.areaRanges.find((x) => x.id === area);
      if (range && (o.gba == null || !range.test(o.gba))) return false;
    }
    return true;
  });
}

export function paginate(items, page, pageSize = CATALOG_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    totalPages,
    items: items.slice(start, start + pageSize),
  };
}
