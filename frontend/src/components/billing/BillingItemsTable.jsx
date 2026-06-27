import Card from "../ui/Card";
import TableWrapper from "../ui/TableWrapper";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

function BillingItemsTable({ items, setItems, removeItem }) {
  return (
    <Card title="Billing Items">
      {items.length === 0 ? (
        <EmptyState text="No items added yet" />
      ) : (
        <TableWrapper>
          <table className="billing-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>

                  <td>{item.unitType}</td>

                  <td>
                    <input
                      type="number"
                      min="1"
                      className="qty-input"
                      value={item.qty}
                      onChange={(e) => {
                        const newQty = Number(e.target.value);

                        setItems((prev) =>
                          prev.map((row, rowIndex) =>
                            rowIndex === index
                              ? {
                                  ...row,
                                  qty: newQty,
                                  amount: row.rate * newQty,
                                }
                              : row,
                          ),
                        );
                      }}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      className="rate-input"
                      value={item.rate}
                      onChange={(e) => {
                        const newRate = Number(e.target.value);

                        setItems((prev) =>
                          prev.map((row, rowIndex) =>
                            rowIndex === index
                              ? {
                                  ...row,
                                  rate: newRate,
                                  amount: newRate * row.qty,
                                }
                              : row,
                          ),
                        );
                      }}
                    />
                  </td>

                  <td>₹{Number(item.amount).toLocaleString("en-IN")}</td>

                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(item.productId, item.unitType)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      )}
    </Card>
  );
}

export default BillingItemsTable;
