import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { filterObjects, paginate } from "../lib/catalog.js";

function parsePage(raw) {
  return Math.max(1, parseInt(raw || "1", 10) || 1);
}

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const district = searchParams.get("district") ?? "";
  const cls = searchParams.get("class") ?? "";
  const area = searchParams.get("area") ?? "";
  const format = searchParams.get("format") ?? "";
  const page = parsePage(searchParams.get("page"));
  const showMap = searchParams.get("map") === "1";

  const patchParams = (patch, replace = true) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, val] of Object.entries(patch)) {
        const empty = val == null || val === "" || val === false;
        const defaultPage = key === "page" && (val === 1 || val === "1");
        if (empty || defaultPage) next.delete(key);
        else next.set(key, String(val));
      }
      return next;
    }, { replace });
  };

  const filtered = useMemo(
    () => filterObjects({ q, district, cls, area }),
    [q, district, cls, area],
  );

  const { page: safePage, totalPages, items: paged } = useMemo(
    () => paginate(filtered, page),
    [filtered, page],
  );

  useEffect(() => {
    if (page !== safePage) {
      patchParams({ page: safePage === 1 ? null : safePage });
    }
  }, [page, safePage]);

  const active = Boolean(q || district || cls || area || format);

  const reset = () => patchParams({
    q: null,
    district: null,
    class: null,
    area: null,
    format: null,
    page: null,
    map: null,
  });

  const changePage = (next) => {
    if (next < 1 || next > totalPages || next === safePage) return;
    patchParams({ page: next }, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    q,
    district,
    cls,
    area,
    format,
    page: safePage,
    showMap,
    patchParams,
    filtered,
    paged,
    totalPages,
    active,
    reset,
    changePage,
  };
}
