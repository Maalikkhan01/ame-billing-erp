import "./Pagination.css";

function Pagination({ page, totalPages, onPrevious, onNext }) {
  if (totalPages <= 1) return null;

  return (
    <div className="app-pagination">
      <button
        className="app-page-btn"
        disabled={page === 1}
        onClick={onPrevious}
      >
        Previous
      </button>

      <span className="app-page-info">
        Page {page} of {totalPages}
      </span>

      <button
        className="app-page-btn"
        disabled={page === totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
