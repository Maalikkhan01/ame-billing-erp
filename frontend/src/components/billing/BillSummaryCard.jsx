import Card from "../ui/Card";

function BillSummaryCard({ totalItems, grandTotal, totalProfit }) {
  return (
    <Card title="Bill Summary" className="summary-card bill-summary-card">
      <p>Total Items</p>

      <h2>{totalItems}</h2>

      <p>Grand Total</p>

      <h2 className="summary-total">
        ₹{Number(grandTotal).toLocaleString("en-IN")}
      </h2>

      <p>Total Profit</p>

      <h3 className="summary-profit">
        ₹{Number(totalProfit).toLocaleString("en-IN")}
      </h3>
    </Card>
  );
}

export default BillSummaryCard;
