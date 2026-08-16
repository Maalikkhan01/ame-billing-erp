import { useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import TableWrapper from "../../components/ui/TableWrapper";

import useProfitReport from "../../hooks/useProfitReport";

import "./ProfitReportPage.css";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateRange(type) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (type === "today") {
    return {
      fromDate: getDateString(today),
      toDate: getDateString(today),
    };
  }

  if (type === "yesterday") {
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    return {
      fromDate: getDateString(yesterday),
      toDate: getDateString(yesterday),
    };
  }

  if (type === "week") {
    const startOfWeek = new Date(today);

    const day = startOfWeek.getDay();

    const difference = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(startOfWeek.getDate() - difference);

    return {
      fromDate: getDateString(startOfWeek),
      toDate: getDateString(today),
    };
  }

  if (type === "month") {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      fromDate: getDateString(startOfMonth),
      toDate: getDateString(today),
    };
  }

  return {
    fromDate: "",
    toDate: "",
  };
}

function ProfitReportPage() {
  const [selectedRange, setSelectedRange] = useState("today");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { loading, report, error, loadReport } = useProfitReport();

  const handleRangeChange = (range) => {
    setSelectedRange(range);

    if (range === "custom") {
      setFromDate("");
      setToDate("");

      return;
    }

    const rangeData = getDateRange(range);

    setFromDate(rangeData.fromDate);
    setToDate(rangeData.toDate);

    loadReport(rangeData.fromDate, rangeData.toDate);
  };

  const handleCustomSearch = () => {
    if (!fromDate || !toDate) {
      alert("Select both dates");
      return;
    }

    if (fromDate > toDate) {
      alert("From date cannot be greater than To date");
      return;
    }

    loadReport(fromDate, toDate);
  };

  const summary = report?.summary || {};

  return (
    <MainLayout>
      <div className="profit-report-page">
        <PageHeader
          title="Profit Report"
          subtitle="Analyze sales, cost and profit"
        />

        <Card title="Report Period">
          <div className="profit-report-period">
            <button
              type="button"
              className={
                selectedRange === "today"
                  ? "profit-period-button active"
                  : "profit-period-button"
              }
              onClick={() => handleRangeChange("today")}
            >
              Today
            </button>

            <button
              type="button"
              className={
                selectedRange === "yesterday"
                  ? "profit-period-button active"
                  : "profit-period-button"
              }
              onClick={() => handleRangeChange("yesterday")}
            >
              Yesterday
            </button>

            <button
              type="button"
              className={
                selectedRange === "week"
                  ? "profit-period-button active"
                  : "profit-period-button"
              }
              onClick={() => handleRangeChange("week")}
            >
              This Week
            </button>

            <button
              type="button"
              className={
                selectedRange === "month"
                  ? "profit-period-button active"
                  : "profit-period-button"
              }
              onClick={() => handleRangeChange("month")}
            >
              This Month
            </button>

            <button
              type="button"
              className={
                selectedRange === "custom"
                  ? "profit-period-button active"
                  : "profit-period-button"
              }
              onClick={() => handleRangeChange("custom")}
            >
              Custom Range
            </button>
          </div>

          {selectedRange === "custom" && (
            <div className="profit-custom-filter">
              <div className="profit-date-field">
                <label htmlFor="profit-from-date">From Date</label>

                <input
                  id="profit-from-date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="profit-date-field">
                <label htmlFor="profit-to-date">To Date</label>

                <input
                  id="profit-to-date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="profit-search-button"
                onClick={handleCustomSearch}
                disabled={loading}
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          )}
        </Card>

        {error && <div className="profit-report-error">{error}</div>}

        {loading && !report && (
          <Card>
            <div className="profit-report-loading">
              Loading profit report...
            </div>
          </Card>
        )}

        {report && (
          <>
            <div className="profit-summary-grid">
              <StatCard
                title="Total Sales"
                value={formatCurrency(summary.totalSales)}
              />

              <StatCard
                title="Total Cost"
                value={formatCurrency(summary.totalCost)}
              />

              <StatCard
                title="Gross Profit"
                value={formatCurrency(summary.grossProfit)}
              />

              <StatCard
                title="Profit Margin"
                value={`${Number(summary.profitMargin || 0).toFixed(2)}%`}
              />
            </div>

            <div className="profit-summary-secondary">
              <StatCard title="Total Bills" value={summary.totalBills || 0} />

              <StatCard
                title="Total Quantity"
                value={Number(summary.totalQuantity || 0).toLocaleString(
                  "en-IN",
                )}
              />
            </div>

            <Card title="Product-wise Profit">
              <TableWrapper>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Sales</th>
                      <th>Cost</th>
                      <th>Profit</th>
                      <th>Margin</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.products?.length > 0 ? (
                      report.products.map((product) => (
                        <tr key={product.productId}>
                          <td>{product.productName}</td>

                          <td>
                            {Number(product.quantity || 0).toLocaleString(
                              "en-IN",
                            )}
                          </td>

                          <td>{formatCurrency(product.sales)}</td>

                          <td>{formatCurrency(product.cost)}</td>

                          <td>{formatCurrency(product.profit)}</td>

                          <td>{Number(product.margin || 0).toFixed(2)}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="profit-report-empty">
                          No product profit data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </TableWrapper>
            </Card>

            <Card title="Customer-wise Profit">
              <TableWrapper>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Sales</th>
                      <th>Cost</th>
                      <th>Profit</th>
                      <th>Margin</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.customers?.length > 0 ? (
                      report.customers.map((customer) => (
                        <tr key={customer.customerId}>
                          <td>{customer.customerName}</td>

                          <td>{formatCurrency(customer.sales)}</td>

                          <td>{formatCurrency(customer.cost)}</td>

                          <td>{formatCurrency(customer.profit)}</td>

                          <td>{Number(customer.margin || 0).toFixed(2)}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="profit-report-empty">
                          No customer profit data found.
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

export default ProfitReportPage;
