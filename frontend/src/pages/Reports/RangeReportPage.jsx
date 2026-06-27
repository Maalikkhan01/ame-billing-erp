import { useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import StatCard from "../../components/ui/StatCard";

import useRangeReport from "../../hooks/useRangeReport";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import TableWrapper from "../../components/ui/TableWrapper";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

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
        <PageHeader
          title="Date Range Report"
          subtitle="Generate custom date reports"
        />
        <Card title="Filters">
          <div className="range-filter-grid">
            <FormField
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <FormField
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

            <Button onClick={handleSearch}>Search</Button>
          </div>
        </Card>
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
          <Card title="Bills">
            <TableWrapper>
              <table className="app-table">
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
            </TableWrapper>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

export default RangeReportPage;
