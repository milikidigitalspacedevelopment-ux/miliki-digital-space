import {
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";

function TableActions({
  row,
  onView,
  onEdit,
  onDelete,
}) {

  return (
    <div className="d-flex gap-2">

      {onView && (
        <button
          className="btn btn-sm btn-info"
          onClick={() => onView(row)}
        >
          <FaEye />
        </button>
      )}

      {onEdit && (
        <button
          className="btn btn-sm btn-warning"
          onClick={() => onEdit(row)}
        >
          <FaEdit />
        </button>
      )}

      {onDelete && (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(row)}
        >
          <FaTrash />
        </button>
      )}

    </div>
  );
}

export default TableActions;