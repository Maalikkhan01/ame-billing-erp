import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import "./CustomerProfile.css";
import useCustomerProfile from "../../hooks/useCustomerProfile";
import { useReceivePayment } from "../../hooks/useReceivePayment";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TableWrapper from "../../components/ui/TableWrapper";

import FormField from "../../components/ui/FormField";

function CustomerProfilePage() {
  const { id } = useParams();

  const { profile, loading, refreshProfile } = useCustomerProfile(id);

  const [amount, setAmount] = useState("");

  const [note, setNote] = useState("");

  const [paymentMode, setPaymentMode] = useState("CASH");

  const [ledgerFilter, setLedgerFilter] = useState("ALL");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const amountRef = useRef(null);
  const noteRef = useRef(null);
  const paymentModeRef = useRef(null);

  const { submitPayment, loading: paymentLoading } = useReceivePayment();

  if (loading) {
    return (
      <div className="print-area">
        <MainLayout>
          <h2>Loading...</h2>
        </MainLayout>
      </div>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <h2>Profile Not Found</h2>
      </MainLayout>
    );
  }

  const { customer, summary, bills, ledger } = profile;
  const totalPayment = ledger

    .filter((item) => item.type === "PAYMENT")
    .reduce((sum, item) => sum + item.amount, 0);

  const filteredLedger = ledger.filter((entry) => {
    const entryDate = new Date(entry.createdAt);

    if (fromDate) {
      const from = new Date(fromDate);

      if (entryDate < from) {
        return false;
      }
    }

    if (toDate) {
      const to = new Date(toDate);

      to.setHours(23, 59, 59, 999);

      if (entryDate > to) {
        return false;
      }
    }

    if (ledgerFilter === "ALL") return true;

    return entry.type === ledgerFilter;
  });

  const handleReceivePayment = async () => {
    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (paymentAmount > summary.currentDue) {
      alert(`Payment cannot exceed due amount (₹${summary.currentDue})`);
      return;
    }

    try {
      await submitPayment({
        customerId: customer._id,
        amount: paymentAmount,
        note: note.trim(),
        paymentMode,
      });

      alert("Payment Received Successfully");

      setAmount("");
      setNote("");
      setPaymentMode("CASH");

      amountRef.current?.focus();

      await refreshProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Payment Failed");
    }
  };

  return (
    <MainLayout>
      <h1 className="no-print">Customer Profile</h1>

      <Card className="profile-header-card no-print">
        <h2>{customer.name}</h2>

        <p>{customer.mobile || "-"}</p>

        <p>{customer.address}</p>
      </Card>

      <div className=" summary-grid no-print">
        <Card className="profile-summary-card">
          <h3>Current Due</h3>

          <h2 className={summary.currentDue > 0 ? "due-red" : "due-green"}>
            ₹{summary.currentDue.toLocaleString("en-IN")}
          </h2>
        </Card>

        <Card className="profile-summary-card">
          <div className="summary-card-title">Total Bills</div>

          <h2>{summary.totalBills}</h2>
        </Card>

        <Card className="profile-summary-card">
          <h3>Total Sale</h3>

          <h2>₹{summary.totalSale.toLocaleString("en-IN")}</h2>
        </Card>

        <Card className="profile-summary-card">
          <h3>Total Payment</h3>

          <h2>₹{totalPayment.toLocaleString("en-IN")}</h2>
        </Card>

        <Card className="profile-summary-card">
          <h3>Highest Bill</h3>

          <h2>₹{(summary.highestBill || 0).toLocaleString("en-IN")}</h2>
        </Card>

        <Card className="profile-summary-card">
          <h3>Average Bill</h3>

          <h2>₹{(summary.averageBill || 0).toLocaleString("en-IN")}</h2>
        </Card>

        <Card className="profile-summary-card">
          <h3>Last Purchase</h3>

          <h2>
            {summary.lastPurchase
              ? new Date(summary.lastPurchase).toLocaleDateString()
              : "-"}
          </h2>
        </Card>
      </div>

      {/* RECEIVE PAYMENT */}
      <Card className="payment-card no-print">
        <div className="payment-header">
          <h2>Receive Payment</h2>

          <Button variant="secondary" onClick={() => window.print()}>
            Print Statement
          </Button>
        </div>
        <div className="payment-form-grid">
          <FormField
            ref={amountRef}
            type="number"
            min="1"
            max={summary.currentDue}
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                noteRef.current?.focus();
              }
            }}
          />

          <FormField
            ref={noteRef}
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                paymentModeRef.current?.focus();
              }
            }}
          />
          <FormField
            as="select"
            ref={paymentModeRef}
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await handleReceivePayment();
              }
            }}
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="BANK">Bank</option>
          </FormField>

          <Button
            variant="success"
            disabled={paymentLoading}
            onClick={handleReceivePayment}
          >
            {paymentLoading ? "Receiving..." : "Receive Payment"}
          </Button>
        </div>
      </Card>
      <Card title="Invoices" className="no-print">
        <TableWrapper>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Bill No</th>

                <th>Amount</th>

                <th>Paid</th>

                <th>Due</th>
              </tr>
            </thead>

            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No Invoices Found
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill._id}>
                    <td>
                      <Link to={`/invoice/${bill._id}`}>{bill.billNumber}</Link>
                    </td>

                    <td>₹{bill.totalAmount.toLocaleString("en-IN")}</td>

                    <td className={bill.paidAmount > 0 ? "invoice-paid" : ""}>
                      ₹{bill.paidAmount.toLocaleString("en-IN")}
                    </td>

                    <td className={bill.dueAmount > 0 ? "invoice-due" : ""}>
                      ₹{bill.dueAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
      </Card>

      <Card className="ledger-card">
        {/* FILTER BUTTONS */}
        <div className=" ledger-header no-print">
          <Button
            variant={ledgerFilter === "ALL" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setLedgerFilter("ALL")}
          >
            All
          </Button>

          <Button
            variant={ledgerFilter === "SALE" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setLedgerFilter("SALE")}
          >
            Sales
          </Button>

          <Button
            variant={ledgerFilter === "PAYMENT" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setLedgerFilter("PAYMENT")}
          >
            Payments
          </Button>
        </div>

        {/* DATE FILTER */}
        <div className="date-filters no-print">
          <div className="date-filter">
            <label>From Date</label>

            <FormField
              as="input"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="date-filter">
            <label>To Date</label>

            <FormField
              as="input"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* STATEMENT HEADER */}
        <div className="statement-header">
          <h3>AM ENTERPRISES</h3>

          <h4>CUSTOMER STATEMENT</h4>

          <p>
            <strong>Customer:</strong> {customer.name}
          </p>

          <p>
            <strong>Mobile:</strong> {customer.mobile}
          </p>
        </div>

        <TableWrapper>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Particulars</th>
                <th>Remark</th>
                <th>Mode</th>
                <th>Sale</th>
                <th>Payment</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    No Ledger Records Found
                  </td>
                </tr>
              ) : (
                filteredLedger.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      {new Date(entry.createdAt).toLocaleDateString("en-GB")}{" "}
                      {new Date(entry.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td>
                      {entry.type === "SALE"
                        ? "Invoice Sale"
                        : "Payment Received"}
                    </td>
                    <td className="remark-cell">{entry.note || "-"}</td>

                    <td>{entry.paymentMode || "-"}</td>

                    <td>{entry.type === "SALE" ? `₹${entry.amount}` : "-"}</td>

                    <td>
                      {entry.type === "PAYMENT" ? `₹${entry.amount}` : "-"}
                    </td>

                    <td>₹{entry.balanceAfter}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
        <div className="ledger-summary">
          <div>Total Sale: ₹{summary.totalSale.toLocaleString("en-IN")}</div>

          <div>Total Payment: ₹{totalPayment.toLocaleString("en-IN")}</div>

          <div>
            <strong>
              Current Due: ₹{summary.currentDue.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}

export default CustomerProfilePage;
