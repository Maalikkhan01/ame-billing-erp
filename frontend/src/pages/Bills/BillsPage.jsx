import { useState } from "react";
import { Link } from "react-router-dom";

import "./BillsPage.css";

import MainLayout from "../../components/layout/MainLayout";
import useBills from "../../hooks/useBills";

function BillsPage() {
  const { loading, bills, error, page, totalPages, loadBills } = useBills();

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

  return (
    <MainLayout>
      <h1 className="bills-title">Bills History</h1>

      <br />

      <input
        type="text"
        className="bills-search"
        placeholder="Search Customer / Bill No"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          loadBills(1, e.target.value);
        }}
      />
      <div className="bills-card">
        <div className="total-bills-card">
          <span>Total Bills</span>

          <h2>{bills.length}</h2>
        </div>

        <br />

        {bills.length === 0 ? (
          <h3>No Bills Found</h3>
        ) : (
          <table className="bills-table">
            <thead
              style={{
                background: "#f8fafc",
              }}
            >
              <tr>
                <th>Bill No</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.billNumber}</td>

                  <td>{bill.customerId?.name}</td>

                  <td>{bill.customerId?.mobile || "-"}</td>

                  <td>₹{Number(bill.totalAmount).toLocaleString("en-IN")}</td>

                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>

                  <td>
                    <Link className="view-btn" to={`/invoice/${bill._id}`}>
                      View Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pagination-wrapper">
        <button
          disabled={page === 1}
          onClick={() => loadBills(page - 1, search)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => loadBills(page + 1, search)}
        >
          Next
        </button>
      </div>
    </MainLayout>
  );
}

export default BillsPage;
