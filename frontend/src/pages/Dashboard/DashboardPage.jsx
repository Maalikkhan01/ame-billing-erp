import { Link } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/ui/StatCard";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import TableWrapper from "../../components/ui/TableWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import useDashboard from "../../hooks/useDashboard";

import "./DashboardPage.css";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function DashboardPage() {
  const { loading, dashboard, error } = useDashboard();

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

  const summary = dashboard?.summary || {};

  const topSellingProducts = dashboard?.topSellingProducts || [];

  const topProfitableProducts = dashboard?.topProfitableProducts || [];

  const collectionByMode = dashboard?.collectionByMode || {
    CASH: 0,
    UPI: 0,
    BANK: 0,
  };

  return (
    <MainLayout>
      <div className="dashboard-page">
        <PageHeader title="Dashboard" subtitle="Today's business overview" />

        {/* =========================================
            BUSINESS SUMMARY
        ========================================= */}

        <div className="dashboard-stats">
          <StatCard
            title="Today's Sales"
            value={formatCurrency(summary.totalSales)}
          />

          <StatCard
            title="Today's Cost"
            value={formatCurrency(summary.totalCost)}
          />

          <StatCard
            title="Today's Profit"
            value={formatCurrency(summary.totalProfit)}
          />

          <StatCard
            title="Profit Margin"
            value={`${Number(summary.profitMargin || 0).toFixed(2)}%`}
          />

          <StatCard
            title="Collection"
            value={formatCurrency(summary.totalCollection)}
          />

          <StatCard
            title="Today's Bills"
            value={formatNumber(summary.totalBills)}
          />

          <StatCard
            title="Today's Due Sale"
            value={formatCurrency(summary.totalDue)}
          />
        </div>

        {/* =========================================
            RECENT BILLS
        ========================================= */}

        <Card title="Recent Bills">
          {dashboard?.recentBills?.length === 0 ? (
            <EmptyState text="No Recent Bills" />
          ) : (
            <TableWrapper>
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Bill No</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard?.recentBills?.map((bill) => (
                    <tr key={bill._id}>
                      <td>{bill.billNumber}</td>

                      <td>{bill.customerId?.name || "-"}</td>

                      <td>
                        {formatCurrency(bill.grandTotal ?? bill.totalAmount)}
                      </td>

                      <td>{formatCurrency(bill.paidAmount)}</td>

                      <td>{formatCurrency(bill.dueAmount)}</td>

                      <td>
                        {bill.createdAt
                          ? new Date(bill.createdAt).toLocaleString("en-IN")
                          : "-"}
                      </td>

                      <td>
                        <Button as={Link} to={`/invoice/${bill._id}`} size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          )}
        </Card>

        {/* =========================================
            TOP DUE CUSTOMERS
        ========================================= */}

        <Card title="Top Due Customers">
          {dashboard?.topDueCustomers?.length === 0 ? (
            <EmptyState text="No Due Customers" />
          ) : (
            <TableWrapper>
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Due Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard?.topDueCustomers?.map((customer) => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>

                      <td>{customer.mobile}</td>

                      <td>{formatCurrency(customer.currentDue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          )}
        </Card>

        {/* =========================================
            TOP SELLING + TOP PROFITABLE
        ========================================= */}

        <div className="dashboard-report-grid">
          <Card title="Top Selling Products">
            {topSellingProducts.length === 0 ? (
              <EmptyState text="No products sold today" />
            ) : (
              <TableWrapper>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Sales</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topSellingProducts.map((product) => (
                      <tr key={product.productId}>
                        <td>{product.productName}</td>

                        <td>{formatNumber(product.quantity)}</td>

                        <td>{formatCurrency(product.sales)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
            )}
          </Card>

          <Card title="Top Profitable Products">
            {topProfitableProducts.length === 0 ? (
              <EmptyState text="No profit data available today" />
            ) : (
              <TableWrapper>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Sales</th>
                      <th>Profit</th>
                      <th>Margin</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topProfitableProducts.map((product) => (
                      <tr key={product.productId}>
                        <td>{product.productName}</td>

                        <td>{formatCurrency(product.sales)}</td>

                        <td>{formatCurrency(product.profit)}</td>

                        <td>{Number(product.margin || 0).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
            )}
          </Card>
        </div>

        {/* =========================================
            COLLECTION BY PAYMENT MODE
        ========================================= */}

        <Card title="Today's Collection by Payment Mode">
          <div className="dashboard-payment-mode-grid">
            <div className="dashboard-payment-mode-card">
              <span>Cash</span>

              <strong>{formatCurrency(collectionByMode.CASH)}</strong>
            </div>

            <div className="dashboard-payment-mode-card">
              <span>UPI</span>

              <strong>{formatCurrency(collectionByMode.UPI)}</strong>
            </div>

            <div className="dashboard-payment-mode-card">
              <span>Bank</span>

              <strong>{formatCurrency(collectionByMode.BANK)}</strong>
            </div>

            <div className="dashboard-payment-mode-card">
              <span>Total</span>

              <strong>{formatCurrency(summary.totalCollection)}</strong>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;
