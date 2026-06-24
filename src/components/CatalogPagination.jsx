import { useI18n } from "../i18n/I18nContext.jsx";

export function CatalogPagination({ page, totalPages, onChange }) {
  const { t } = useI18n();
  if (totalPages <= 1) return null;

  return (
    <nav className="catalog-pagination" aria-label={t("common.paginationLabel")}>
      <button
        type="button"
        className="page-btn page-arrow"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label={t("common.prevPage")}
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={"page-btn" + (n === page ? " active" : "")}
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className="page-btn page-arrow"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label={t("common.nextPage")}
      >
        →
      </button>
    </nav>
  );
}
