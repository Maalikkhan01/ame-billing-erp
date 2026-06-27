import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import "./HoldBillsPage.css";
import useHoldBills from "../../hooks/useHoldBills";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import TableWrapper from "../../components/ui/TableWrapper";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";

function HoldBillsPage() {
  const [deleteBillId, setDeleteBillId] = useState(null);
  const { loading, holdBills, error, removeHoldBill } = useHoldBills();
  const navigate = useNavigate();
  const handleResume = (holdBill) => {
    navigate("/billing", {
      state: { holdBill },
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <h2>{error}</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Hold Bills"
        subtitle={`${holdBills.length} Bills On Hold`}
      />

      <Card title="Hold Bills">
        {holdBills.length === 0 ? (
          <EmptyState text="No Hold Bills Found" />
        ) : (
          <TableWrapper>
            <table className="hold-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {holdBills.map((bill, index) => (
                  <tr key={bill._id}>
                    <td>{index + 1}</td>

                    <td>{bill.customerName}</td>

                    <td>{bill.items?.length || 0}</td>

                    <td>₹{Number(bill.grandTotal).toLocaleString("en-IN")}</td>

                    <td>{new Date(bill.createdAt).toLocaleString("en-IN")}</td>

                    <td>
                      <div className="action-group">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleResume(bill)}
                        >
                          Resume
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteBillId(bill._id)}
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
        )}
      </Card>
      <ConfirmModal
        open={!!deleteBillId}
        title="Delete Hold Bill"
        message="Are you sure you want to delete this hold bill?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          await removeHoldBill(deleteBillId);

          setDeleteBillId(null);
        }}
        onCancel={() => setDeleteBillId(null)}
      />
    </MainLayout>
  );
}

export default HoldBillsPage;
