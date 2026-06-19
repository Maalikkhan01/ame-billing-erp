import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DueReportPage.css";

import MainLayout from "../../components/layout/MainLayout";
import useDueReport from "../../hooks/useDueReport";

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
        <h1>Due Report</h1>

        {/* Outstanding Due Card */}
        <div className="due-summary-card">
          <div className="due-summary-title">Outstanding Due</div>

          <div className="due-summary-amount">
            ₹{Number(data.totalDue).toLocaleString("en-IN")}
          </div>
        </div>

        {/* Search */}
        <div className="search-card">
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 ? (
          <div className="due-table-card">
            <div className="empty-state">No Due Customers Found</div>
          </div>
        ) : (
          <div className="due-table-card">
            <div className="due-table-wrapper">
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
                        <button
                          className="receive-btn"
                          onClick={() => navigate(`/customers/${customer._id}`)}
                        >
                          Receive Payment
                        </button>
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

export default DueReportPage;
