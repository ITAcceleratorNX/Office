export function CatalogPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="catalog-pagination" aria-label="Страницы каталога">
      <button
        type="button"
        className="page-btn page-arrow"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Предыдущая страница"
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
        aria-label="Следующая страница"
      >
        →
      </button>
    </nav>
  );
}
