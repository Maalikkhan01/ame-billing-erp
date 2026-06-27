import Card from "../ui/Card";
import Button from "../ui/Button";

function BillActions({
  items,
  holdingBill,
  savingBill,
  handleHoldBill,
  handleSave,
}) {
  return (
    <Card title="Bill Actions" className="bill-action-card">
      <div className="action-buttons">
        <Button
          variant="warning"
          disabled={items.length === 0 || holdingBill}
          onClick={handleHoldBill}
        >
          {holdingBill ? "Holding..." : "Hold Bill"}
        </Button>

        <Button
          disabled={items.length === 0 || savingBill}
          onClick={handleSave}
        >
          {savingBill ? "Creating..." : "Create Bill"}
        </Button>
      </div>
    </Card>
  );
}

export default BillActions;
