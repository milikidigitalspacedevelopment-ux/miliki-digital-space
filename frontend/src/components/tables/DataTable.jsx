import LoadingSpinner from "../common/LoadingSpinner";
import TableEmptyState from "./TableEmptyState";
import TableActions from "./TableActions";

function DataTable({
  columns = [],
  data = [],
  loading = false,
  actions = false,
  onView,
  onEdit,
  onDelete,
}) {

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!data.length) {
    return <TableEmptyState />;
  }

  return (
    <div className="table-responsive">

      <table className="table table-hover align-middle">

        <thead className="table-light">

          <tr>

            {columns.map((column) => (
              <th key={column.key}>
                {column.label}
              </th>
            ))}

            {actions && <th>Actions</th>}

          </tr>

        </thead>

        <tbody>

          {data.map((row) => (

            <tr key={row.id}>

              {columns.map((column) => (
                <td key={column.key}>
                  {row[column.key]}
                </td>
              ))}

              {actions && (
                <td>

                  <TableActions
                    row={row}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />

                </td>
              )}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default DataTable;