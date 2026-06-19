import { useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import StatCard from "../../components/ui/StatCard";

import useRangeReport from "../../hooks/useRangeReport";

import "./RangeReportPage.css";
function RangeReportPage() {
  const { loading, report, loadReport } = useRangeReport();

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      return alert("Select both dates");
    }

    loadReport(fromDate, toDate);
  };

  return (
    <MainLayout>
      <div className="range-page">
        <h1>Date Range Report</h1>

        <br />
        <div className="range-filter-card">
          <div className="range-filter-grid">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="range-input"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="range-input"
            />

            <button onClick={handleSearch} className="search-btn">
              Search
            </button>
          </div>
        </div>

        <br />
        <br />

        {loading && <h3>Loading...</h3>}

        {report && (
          <div className="range-summary-grid">
            <StatCard
              title="Sales"
              value={`₹${Number(report.summary.totalSales).toLocaleString(
                "en-IN",
              )}`}
            />

            <StatCard
              title="Collection"
              value={`₹${Number(report.summary.totalCollection).toLocaleString(
                "en-IN",
              )}`}
            />

            <StatCard
              title="Due"
              value={`₹${Number(report.summary.totalDue).toLocaleString(
                "en-IN",
              )}`}
            />

            <StatCard title="Bills" value={report.summary.totalBills} />
          </div>
        )}
        {report && (
          <div className="range-table-card">
            <h2>Bills</h2>

            <div className="range-table-wrapper">
              <table className="range-table">
                <thead>
                  <tr>
                    <th>Bill No</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {report.bills.map((bill) => (
                    <tr key={bill._id}>
                      <td>{bill.billNumber}</td>

                      <td>
                        ₹{Number(bill.totalAmount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default RangeReportPage;
