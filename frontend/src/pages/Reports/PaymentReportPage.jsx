import { useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import TableWrapper from "../../components/ui/TableWrapper";
import StatCard from "../../components/ui/StatCard";

import usePaymentReport from "../../hooks/usePaymentReport";

import "./PaymentReportPage.css";

function PaymentReportPage() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);

  const { loading, report, error, loadReport } = usePaymentReport();

  const handleLoadReport = () => {
    loadReport(selectedDate);
  };

  return (
    <MainLayout>
      <div className="payment-report-page">
        <PageHeader
          title="Payment Report"
          subtitle="All received payment entries"
        />

        <div className="payment-report-actions">
          <div className="payment-report-date-filter">
            <label htmlFor="payment-report-date">Date</label>

            <input
              id="payment-report-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="payment-report-load-button"
            onClick={handleLoadReport}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load Payments"}
          </button>
        </div>

        {error && <div className="payment-report-error">{error}</div>}

        {report && (
          <>
            <div className="payment-report-summary">
              <StatCard
                title="Total Received"
                value={`₹${Number(
                  report.summary?.totalReceived || 0,
                ).toLocaleString("en-IN")}`}
              />

              <StatCard
                title="Customers Paid"
                value={report.summary?.customersPaid || 0}
              />
            </div>

            <Card title="Received Payments">
              <TableWrapper>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Customer</th>
                      <th>Mobile</th>
                      <th>Amount</th>
                      <th>Payment Mode</th>
                      <th>Note</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.payments?.length > 0 ? (
                      report.payments.map((payment) => (
                        <tr key={payment._id}>
                          <td>
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleString(
                                  "en-IN",
                                )
                              : "-"}
                          </td>

                          <td>{payment.customerId?.name || "-"}</td>

                          <td>{payment.customerId?.mobile || "-"}</td>

                          <td>
                            ₹
                            {Number(payment.amount || 0).toLocaleString(
                              "en-IN",
                            )}
                          </td>

                          <td>{payment.paymentMode || "CASH"}</td>

                          <td>{payment.note || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="payment-report-empty">
                          No payment entries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </TableWrapper>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default PaymentReportPage;
