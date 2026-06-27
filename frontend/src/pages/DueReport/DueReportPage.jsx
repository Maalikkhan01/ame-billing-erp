import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DueReportPage.css";

import MainLayout from "../../components/layout/MainLayout";
import useDueReport from "../../hooks/useDueReport";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import SearchInput from "../../components/ui/SearchInput";
import EmptyState from "../../components/ui/EmptyState";
import TableWrapper from "../../components/ui/TableWrapper";
import Button from "../../components/ui/Button";

function DueReportPage() {
  const navigate = useNavigate();

  const { loading, data, error } = useDueReport();

  const [search, setSearch] = useState("");

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

  const filteredCustomers = data.customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MainLayout>
      <div className="due-page">
        <PageHeader
          title="Due Report"
          subtitle={`${filteredCustomers.length} Customers With Due`}
        />

        {/* Outstanding Due Card */}
        <Card className="due-summary-card">
          <div className="due-summary-title">Outstanding Due</div>

          <div className="due-summary-amount">
            ₹{Number(data.totalDue).toLocaleString("en-IN")}
          </div>
        </Card>

        {/* Search */}
        <SearchInput
          value={search}
          placeholder="Search customer..."
          onChange={setSearch}
        />

        {/* Empty State */}
        {filteredCustomers.length === 0 ? (
          <Card title="Due Customers">
            <EmptyState text="No Due Customers Found" />
          </Card>
        ) : (
          <Card title="Due Customers">
            <TableWrapper>
              <table className="due-table">
                <thead>
                  <tr>
                    <th>Customer</th>

                    <th>Mobile</th>

                    <th>Due</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>

                      <td>{customer.mobile}</td>

                      <td>₹{customer.currentDue.toLocaleString("en-IN")}</td>

                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => navigate(`/customers/${customer._id}`)}
                        >
                          Receive Payment
                        </Button>
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

export default DueReportPage;
