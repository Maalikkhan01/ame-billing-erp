import Button from "../ui/Button";
import TableWrapper from "../ui/TableWrapper";

import "./CategoryTable.css";

function CategoryTable({ categories, onEdit, onDelete, loading }) {
  return (
    <TableWrapper>
      <table className="category-table">
        <thead>
          <tr>
            <th style={{ width: "80px" }}>#</th>

            <th>Category</th>

            <th>Description</th>

            <th style={{ width: "120px" }}>Sort Order</th>

            <th style={{ width: "120px" }}>Status</th>

            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>

              <td className="category-name">{category.name}</td>

              <td>{category.description || "-"}</td>

              <td>{category.sortOrder}</td>

              <td>
                {category.active ? (
                  <span className="category-status-active">Active</span>
                ) : (
                  <span className="category-status-inactive">Inactive</span>
                )}
              </td>

              <td>
                <div className="category-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    disabled={loading}
                    onClick={() => onDelete(category)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

export default CategoryTable;
