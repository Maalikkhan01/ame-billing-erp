import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/ui/StatCard";
import useDashboard from "../../hooks/useDashboard";

import "./DashboardPage.css";

import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import TableWrapper from "../../components/ui/TableWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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

  return (
    <MainLayout>
      <PageHeader title="Dashboard" subtitle="Today's business overview" />

      <div className="dashboard-stats">
        <StatCard
          title="Today's Sales"
          value={`₹${dashboard.summary.totalSales.toLocaleString("en-IN")}`}
        />

        <StatCard
          title="Collection"
          value={`₹${dashboard.summary.totalCollection.toLocaleString("en-IN")}`}
        />

        <StatCard title="Customers" value={dashboard.summary.customerCount} />

        <StatCard title="Products" value={dashboard.summary.productCount} />
        <StatCard title="Today's Bills" value={dashboard.summary.totalBills} />

        <StatCard
          title="Today's Due Sale"
          value={`₹${dashboard.summary.totalDue.toLocaleString("en-IN")}`}
        />

        <StatCard
          title="Outstanding Due"
          value={`₹${dashboard.summary.outstandingDue.toLocaleString("en-IN")}`}
        />
      </div>
      <Card title="Recent Bills">
        {dashboard.recentBills?.length === 0 ? (
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
                {dashboard.recentBills?.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.billNumber}</td>

                    <td>{bill.customerId?.name}</td>

                    <td>₹{Number(bill.totalAmount).toLocaleString("en-IN")}</td>

                    <td>₹{Number(bill.paidAmount).toLocaleString("en-IN")}</td>

                    <td>₹{Number(bill.dueAmount).toLocaleString("en-IN")}</td>

                    <td>{new Date(bill.createdAt).toLocaleString("en-IN")}</td>

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

      <Card title="Top Due Customers">
        {dashboard.topDueCustomers?.length === 0 ? (
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
                {dashboard.topDueCustomers?.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>

                    <td>{customer.mobile}</td>

                    <td>
                      ₹{Number(customer.currentDue).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        )}
      </Card>
    </MainLayout>
  );
}

export default DashboardPage;
