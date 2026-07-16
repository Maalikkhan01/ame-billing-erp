import { useState } from "react";
import { Link } from "react-router-dom";

import "./BillsPage.css";

import MainLayout from "../../components/layout/MainLayout";
import useBills from "../../hooks/useBills";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import SearchInput from "../../components/ui/SearchInput";
import EmptyState from "../../components/ui/EmptyState";
import TableWrapper from "../../components/ui/TableWrapper";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";

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
      <PageHeader
        title="Bills History"
        subtitle={`${bills.length} Bills Found`}
      />

      <SearchInput
        value={search}
        placeholder="Search customer or bill number..."
        onChange={(value) => {
          setSearch(value);

          loadBills(1, value);
        }}
      />
      <Card title="Bills">
        <div className="bill-count">Showing {bills.length} bills</div>

        {bills.length === 0 ? (
          <EmptyState text="No Bills Found" />
        ) : (
          <TableWrapper>
            <table className="bills-table">
              <thead>
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
                      <Button as={Link} to={`/bills/${bill._id}`}>
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
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrevious={() => loadBills(page - 1, search)}
        onNext={() => loadBills(page + 1, search)}
      />
    </MainLayout>
  );
}

export default BillsPage;
