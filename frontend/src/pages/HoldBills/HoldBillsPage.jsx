import MainLayout from "../../components/layout/MainLayout";
import "./HoldBillsPage.css";
import useHoldBills from "../../hooks/useHoldBills";
import { useNavigate } from "react-router-dom";

function HoldBillsPage() {
  const { loading, holdBills, error, removeHoldBill } = useHoldBills();
  const navigate = useNavigate();
  const handleResume = (bill) => {
    navigate("/billing", {
      state: {
        holdBill: bill,
      },
    });
  };

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
      <h1 className="hold-title">Hold Bills</h1>

      <div className="hold-card">
        {holdBills.length === 0 ? (
          <h3>No Hold Bills Found</h3>
        ) : (
          <div className="hold-table-wrapper">
            <table className="hold-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {holdBills.map((bill, index) => (
                  <tr key={bill._id}>
                    <td>{index + 1}</td>

                    <td>{bill.customerName}</td>

                    <td>{bill.items?.length || 0}</td>

                    <td>₹{Number(bill.grandTotal).toLocaleString("en-IN")}</td>

                    <td>{new Date(bill.createdAt).toLocaleString("en-IN")}</td>

                    <td>
                      <button
                        className="resume-btn"
                        onClick={() => handleResume(bill)}
                      >
                        Resume
                      </button>{" "}
                      <button
                        className="delete-btn"
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            "Delete this hold bill?",
                          );

                          if (confirmDelete) {
                            removeHoldBill(bill._id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default HoldBillsPage;
