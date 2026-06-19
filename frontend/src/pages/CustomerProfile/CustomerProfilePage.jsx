import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import "./CustomerProfile.css";
import useCustomerProfile from "../../hooks/useCustomerProfile";
import { useReceivePayment } from "../../hooks/useReceivePayment";

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
      <h1>Customer Profile</h1>

      <div className="profile-header-card">
        <h2>{customer.name}</h2>

        <p>{customer.mobile || "-"}</p>

        <p>{customer.address}</p>
      </div>

      <div className=" summary-grid no-print">
        <div className="profile-header-card">
          <h3>Current Due</h3>

          <h2 className={summary.currentDue > 0 ? "due-red" : "due-green"}>
            ₹{summary.currentDue.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="profile-header-card">
          <h3>Total Bills</h3>

          <h2>{summary.totalBills}</h2>
        </div>

        <div className="profile-header-card">
          <h3>Total Sale</h3>

          <h2>₹{summary.totalSale.toLocaleString("en-IN")}</h2>
        </div>

        <div className="profile-header-card">
          <h3>Total Payment</h3>

          <h2>₹{totalPayment.toLocaleString("en-IN")}</h2>
        </div>

        <div className="profile-header-card">
          <h3>Highest Bill</h3>

          <h2>₹{(summary.highestBill || 0).toLocaleString("en-IN")}</h2>
        </div>

        <div className="profile-header-card">
          <h3>Average Bill</h3>

          <h2>₹{(summary.averageBill || 0).toLocaleString("en-IN")}</h2>
        </div>

        <div className="profile-header-card">
          <h3>Last Purchase</h3>

          <h2>
            {summary.lastPurchase
              ? new Date(summary.lastPurchase).toLocaleDateString()
              : "-"}
          </h2>
        </div>
      </div>

      {/* RECEIVE PAYMENT */}
      <div className="payment-card no-print">
        <div className="payment-header">
          <h2>Receive Payment</h2>

          <button className="no-print" onClick={() => window.print()}>
            Print Statement
          </button>
        </div>
        <div className="payment-form-grid">
          <input
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

          <input
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
          <select
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
          </select>

          <button
            disabled={paymentLoading || !amount || Number(amount) <= 0}
            onClick={handleReceivePayment}
          >
            {paymentLoading ? "Receiving..." : "Receive Payment"}
          </button>
        </div>
      </div>

      <div className="invoice-header-top no-print">
        <h2>Invoices</h2>

        <div className="table-wrapper">
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

                    <td>₹{bill.totalAmount}</td>

                    <td>₹{bill.paidAmount}</td>

                    <td>₹{bill.dueAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ledger-card">
        {/* FILTER BUTTONS */}
        <div className=" ledger-header no-print">
          <button onClick={() => setLedgerFilter("ALL")}>All</button>

          <button onClick={() => setLedgerFilter("SALE")}>Sales</button>

          <button onClick={() => setLedgerFilter("PAYMENT")}>Payments</button>
        </div>

        {/* DATE FILTER */}
        <div className="date-filter no-print">
          <label>From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="date-filter no-print">
          <label>To Date</label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
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

        <div className="table-wrapper">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Date</th>

                <th>Particulars</th>
                <th>Mode</th>
                <th>Sale</th>

                <th>Payment</th>

                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    No Ledger Records Found
                  </td>
                </tr>
              ) : (
                filteredLedger.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      {entry.type === "SALE"
                        ? "Invoice Sale"
                        : "Payment Received"}
                    </td>

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
        </div>

        <br />
        <div className="ledger-summary">
          <h5>Total Sale : ₹{summary.totalSale.toLocaleString("en-IN")}</h5>

          <h5>Total Payment : ₹{totalPayment.toLocaleString("en-IN")}</h5>

          <h5>Current Due : ₹{summary.currentDue.toLocaleString("en-IN")}</h5>
        </div>
      </div>
    </MainLayout>
  );
}

export default CustomerProfilePage;
