import { useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import useBillDetails from "../../hooks/useBillDetails";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import TableWrapper from "../../components/ui/TableWrapper";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ReturnModal from "../../components/returns/ReturnModal";
import CancelBillModal from "../../components/cancelBill/CancelBillModal";
import ReceivePaymentModal from "../../components/payment/ReceivePaymentModal";
import AdjustmentModal from "../../components/adjustment/AdjustmentModal";

import useReturn from "../../hooks/useReturn";
import useCancelBill from "../../hooks/useCancelBill";
import usePayment from "../../hooks/usePayment";
import useAdjustment from "../../hooks/useAdjustment";

import "./BillDetailsPage.css";

function BillDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);

  const { submitReturn, loading: returnLoading } = useReturn();
  const { submitCancel, loading: cancelLoading } = useCancelBill();
  const { submitPayment, loading: paymentLoading } = usePayment();
  const { submitAdjustment, loading: adjustmentLoading } = useAdjustment();

  const { bill, loading, error, refreshBill } = useBillDetails(id);

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

  if (!bill) {
    return (
      <MainLayout>
        <EmptyState text="Bill not found" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={`Bill ${bill.billNumber}`}
        subtitle={`Created ${new Date(bill.createdAt).toLocaleString()}`}
        right={
          <Button variant="secondary" onClick={() => navigate("/bills")}>
            Back
          </Button>
        }
      />

      {/* Bill Information */}

      <Card title="Bill Information">
        <div className="bill-details-grid">
          <div>
            <strong>Status</strong>

            <p>{bill.status}</p>
          </div>

          <div>
            <strong>Payment Type</strong>

            <p>{bill.paymentType}</p>
          </div>

          <div>
            <strong>Total</strong>

            <p>₹{bill.totalAmount}</p>
          </div>

          <div>
            <strong>Paid</strong>

            <p>₹{bill.paidAmount || 0}</p>
          </div>

          <div>
            <strong>Due</strong>

            <p>₹{bill.dueAmount || 0}</p>
          </div>

          <div>
            <strong>Returned</strong>

            <p>₹{bill.returnedAmount || 0}</p>
          </div>
        </div>
      </Card>

      {/* Customer */}

      <Card title="Customer Information">
        <div className="bill-details-grid">
          <div>
            <strong>Name</strong>

            <p>{bill.customerId?.name}</p>
          </div>

          <div>
            <strong>Mobile</strong>

            <p>{bill.customerId?.mobile}</p>
          </div>

          <div>
            <strong>Address</strong>

            <p>{bill.customerId?.address || "-"}</p>
          </div>

          <div>
            <strong>Previous Due</strong>

            <p>₹{bill.previousDue}</p>
          </div>
        </div>
      </Card>

      {/* Products */}

      <Card title="Products">
        <TableWrapper>
          <table className="bill-items-table">
            <thead>
              <tr>
                <th>Product</th>

                <th>Qty</th>

                <th>Returned</th>

                <th>Unit</th>

                <th>Rate</th>

                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {bill.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>

                  <td>{item.qty}</td>

                  <td>{item.returnedQty}</td>

                  <td>{item.unitType}</td>

                  <td>₹{item.rate}</td>

                  <td>₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </Card>

      {/* Quick Actions */}

      <Card title="Quick Actions">
        <div className="bill-actions">
          <Button
            onClick={() => setPaymentModalOpen(true)}
            disabled={
              bill.status === "CANCELLED" ||
              bill.status === "FULL_RETURN" ||
              bill.dueAmount <= 0
            }
          >
            Receive Payment
          </Button>

          <Button
            onClick={() => setReturnModalOpen(true)}
            disabled={
              bill.status === "CANCELLED" || bill.status === "FULL_RETURN"
            }
          >
            Return Item
          </Button>

          <Button
            onClick={() => setAdjustmentModalOpen(true)}
            disabled={
              bill.status === "CANCELLED" ||
              bill.status === "FULL_RETURN" ||
              bill.dueAmount <= 0
            }
          >
            Adjustment
          </Button>

          <Button
            variant="danger"
            onClick={() => setCancelModalOpen(true)}
            disabled={
              bill.status === "CANCELLED" || bill.status === "FULL_RETURN"
            }
          >
            Cancel Bill
          </Button>

          <Button as={Link} to={`/invoice/${bill._id}`} variant="secondary">
            Print Invoice
          </Button>
        </div>
      </Card>

      <CancelBillModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onSubmit={async (data) => {
          await submitCancel({
            billId: bill._id,
            ...data,
          });

          await refreshBill();

          setCancelModalOpen(false);
        }}
        loading={cancelLoading}
      />

      <ReceivePaymentModal
        open={paymentModalOpen}
        loading={paymentLoading}
        customer={{
          _id: bill.customerId._id,
          currentDue: bill.dueAmount,
        }}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={async (data) => {
          await submitPayment({
            customerId: bill.customerId._id,
            ...data,
          });

          await refreshBill();

          setPaymentModalOpen(false);
        }}
      />

      <AdjustmentModal
        open={adjustmentModalOpen}
        loading={adjustmentLoading}
        customer={{
          _id: bill.customerId._id,
          currentDue: bill.dueAmount,
        }}
        onClose={() => setAdjustmentModalOpen(false)}
        onSubmit={async (data) => {
          await submitAdjustment({
            customerId: bill.customerId._id,
            ...data,
          });

          await refreshBill();

          setAdjustmentModalOpen(false);
        }}
      />

      <ReturnModal
        open={returnModalOpen}
        bill={bill}
        loading={returnLoading}
        onClose={() => setReturnModalOpen(false)}
        onSubmit={async (data) => {
          await submitReturn({
            billId: bill._id,
            ...data,
          });

          await refreshBill();

          setReturnModalOpen(false);
        }}
      />
    </MainLayout>
  );
}

export default BillDetailsPage;
