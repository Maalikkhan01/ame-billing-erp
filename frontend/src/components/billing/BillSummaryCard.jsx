import Card from "../ui/Card";

function BillSummaryCard({ totalItems, grandTotal }) {
  return (
    <Card title="Bill Summary" className="summary-card bill-summary-card">
      <p>Total Items</p>

      <h2>{totalItems}</h2>

      <p>Grand Total</p>

      <h1 className="summary-total">
        ₹{Number(grandTotal).toLocaleString("en-IN")}
      </h1>
    </Card>
  );
}

export default BillSummaryCard;
