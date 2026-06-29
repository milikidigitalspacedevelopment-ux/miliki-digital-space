function TablePagination({
  page,
  totalPages,
  onPageChange,
}) {

  return (
    <nav>

      <ul className="pagination">

        <li className="page-item">

          <button
            className="page-link"
            disabled={page === 1}
            onClick={() =>
              onPageChange(page - 1)
            }
          >
            Previous
          </button>

        </li>

        <li className="page-item active">

          <span className="page-link">
            {page}
          </span>

        </li>

        <li className="page-item">

          <button
            className="page-link"
            disabled={page === totalPages}
            onClick={() =>
              onPageChange(page + 1)
            }
          >
            Next
          </button>

        </li>

      </ul>

    </nav>
  );
}

export default TablePagination;