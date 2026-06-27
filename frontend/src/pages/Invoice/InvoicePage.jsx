import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import useInvoice from "../../hooks/useInvoice";
import Button from "../../components/ui/Button";
import "./InvoicePrint.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

function InvoicePage() {
  const { id } = useParams();
  const { invoice, loading } = useInvoice(id);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  if (!invoice) {
    return (
      <MainLayout>
        <h2>Invoice Not Found</h2>
      </MainLayout>
    );
  }

  const invoiceDate = new Date(invoice.createdAt).toLocaleDateString("en-IN");
  const ITEMS_PER_PAGE = 30;

  // Unit Sorting
  const unitOrder = {
  PIECE: 1,
  PACKET: 2,
  OUTER: 3,
  BOX: 4,
  BAG: 5,
};
  const sortedItems = [...invoice.items].sort((a, b) => {
    return (unitOrder[a.unitType] || 999) - (unitOrder[b.unitType] || 999);
  });

  const formatUnit = (unit) => {
    switch (unit) {
      case "PIECE":
        return "Pcs";

      case "PACKET":
        return "Pkt";

      case "OUTER":
        return "Outer";

      case "BOX":
        return "Box";

      case "BAG":
        return "Bag";

      default:
        return unit;
    }
  };

  // Chunking pages
  const pages = [];
  for (let i = 0; i < sortedItems.length; i += ITEMS_PER_PAGE) {
    const pageItems = sortedItems.slice(i, i + ITEMS_PER_PAGE);

    // Fill empty rows to maintain A5 layout structure
    while (pageItems.length < ITEMS_PER_PAGE) {
      pageItems.push({
        productName: "",
        unitType: "",
        qty: "",
        rate: "",
        amount: "",
      });
    }
    pages.push(pageItems);
  }

  // Handle Walk-in Customer logic
  const customerName = invoice.customerId?.name || "Cash Customer";
  const isWalkIn = customerName === "Cash Customer";

  return (
    <MainLayout>
      <div className="invoice-container">
        <div className="no-print invoice-toolbar">
          <h1>Invoice Details</h1>
          <Button variant="secondary" onClick={handlePrint}>
            Print Invoice
          </Button>
        </div>

        {pages.map((pageItems, pageIndex) => {
          const isLastPage = pageIndex === pages.length - 1;

          return (
            <div key={pageIndex} className="invoice-page">
              {/* Clean Header Section */}
              <div className="invoice-header">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h2>A M</h2>
                    <p>Pandhurna</p>
                    <p>Mobile: 9074001099</p>
                    <p className="invoice-meta">
                      <strong>Date:</strong> {invoiceDate}
                    </p>
                  </div>

                  <div className="invoice-customer-info">
                    <p className="invoice-meta">
                      <strong>Invoice No:</strong> {invoice.billNumber}
                    </p>
                    <p>
                      <strong>Customer:</strong> {customerName}
                    </p>
                    {!isWalkIn && (
                      <>
                        <p>
                          <strong>Mobile:</strong>{" "}
                          {invoice.customerId?.mobile || ""}
                        </p>
                        <p>
                          <strong>Address:</strong>{" "}
                          {invoice.customerId?.address || ""}
                        </p>

                        <p>
                          <strong>Previous Due :</strong>₹
                          {invoice.previousDue || 0}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Table */}
              <div className="invoice-table-wrapper">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th style={{ width: "8%" }}>S.No</th>
                      <th style={{ width: "52%" }}>Product</th>
                      <th style={{ width: "8%" }}>Qty</th>
                      <th style={{ width: "12%" }}>Unit</th>
                      <th style={{ width: "10%" }}>Rate</th>
                      <th style={{ width: "10%" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((item, index) => (
                      <tr
                        key={index}
                        className={!item.productName ? "empty-row" : ""}
                      >
                        <td style={{ textAlign: "center" }}>
                          {item.productName
                            ? pageIndex * ITEMS_PER_PAGE + index + 1
                            : ""}
                        </td>
                        <td className="invoice-product-name">
                          {item.productName}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {item.productName ? item.qty : ""}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.productName ? formatUnit(item.unitType) : ""}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.productName ? item.rate : ""}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.productName ? item.amount : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Last Page Summary Area -> Fixed to show ONLY on last page */}
              {isLastPage ? (
                <div className="invoice-total-box">
                  <div>Total Items : {invoice.items.length}</div>
                  <div className="grand-total">
                    TOTAL AMOUNT : {formatCurrency(invoice.totalAmount)}
                  </div>
                </div>
              ) : (
                /* Empty spacer to maintain layout height on previous pages */
                <div className="invoice-page-spacer" />
              )}

              <div className="page-footer">
                Page {pageIndex + 1} of {pages.length}
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}

export default InvoicePage;
