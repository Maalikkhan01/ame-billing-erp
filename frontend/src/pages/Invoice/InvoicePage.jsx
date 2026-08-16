import { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import useInvoice from "../../hooks/useInvoice";

import Button from "../../components/ui/Button";

import { downloadPdf } from "../../utils/pdf";
import { sortBillingItems } from "../../utils/billingSort";

import InvoicePrintSizeModal from "../../components/billing/InvoicePrintSizeModal";

import {
  getInvoicePrintRecommendation,
  INVOICE_PRINT_SIZES,
  A6_MAX_ITEMS,
} from "../../utils/invoicePrintSize";

import "./InvoicePrint.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount || 0);

function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { invoice, loading } = useInvoice(id);

  const invoiceRef = useRef(null);

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const initialRecommendation =
    location.state?.printRecommendation ||
    (invoice ? getInvoicePrintRecommendation(invoice) : null);

  const initialPrintSize =
    location.state?.printSize ||
    initialRecommendation?.recommendedSize ||
    INVOICE_PRINT_SIZES.A5;

  const [selectedPrintSize, setSelectedPrintSize] = useState(initialPrintSize);
  const [printSizeModalOpen, setPrintSizeModalOpen] = useState(false);
  const [printAction, setPrintAction] = useState("print");

  if (loading) {
    return (
      <MainLayout>
        <div className="invoice-loading">Loading...</div>
      </MainLayout>
    );
  }

  if (!invoice) {
    return (
      <MainLayout>
        <div className="invoice-not-found">Invoice Not Found</div>
      </MainLayout>
    );
  }

  const invoiceDate = new Date(invoice.createdAt).toLocaleDateString("en-IN");
  const recommendation = getInvoicePrintRecommendation(invoice);

  const isA6 = selectedPrintSize === INVOICE_PRINT_SIZES.A6;
  const ITEMS_PER_PAGE = isA6 ? A6_MAX_ITEMS : 28;

  const sortedItems = sortBillingItems(invoice.items);

  const pages = [];

  for (let i = 0; i < sortedItems.length; i += ITEMS_PER_PAGE) {
    const pageItems = sortedItems.slice(i, i + ITEMS_PER_PAGE);

    if (isA6) {
      // In A6: add 1 empty flex row if items exist to fill space vertically to bottom
      if (pageItems.length > 0) {
        pageItems.push({
          productName: "",
          unitType: "",
          qty: "",
          rate: "",
          amount: "",
        });
      }
    } else {
      // In A5: fill remaining slots up to 28 rows
      while (pageItems.length < ITEMS_PER_PAGE) {
        pageItems.push({
          productName: "",
          unitType: "",
          qty: "",
          rate: "",
          amount: "",
        });
      }
    }

    pages.push(pageItems);
  }

  if (pages.length === 0) {
    pages.push([]);
  }

  const formatUnit = (unit) => {
    switch (unit) {
      case "PIECE":
        return "Pcs";
      case "Ladi":
        return "Ladi";
      case "PACKET":
        return "Pkt";
      case "GRAM":
        return "Gram";
      case "KG":
        return "Kg";
      case "SET":
        return "Set";
      case "Jar":
        return "Jar";
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

  const openPrintModal = (action) => {
    setPrintAction(action);
    const currentRecommendation = getInvoicePrintRecommendation(invoice);
    setSelectedPrintSize(currentRecommendation.recommendedSize);
    setPrintSizeModalOpen(true);
  };

  const handlePrint = () => {
    openPrintModal("print");
  };

  const handleDownloadPdf = () => {
    openPrintModal("pdf");
  };

  const handlePrintSizeConfirm = async () => {
    if (
      selectedPrintSize === INVOICE_PRINT_SIZES.A6 &&
      invoice.items.length > A6_MAX_ITEMS
    ) {
      setSelectedPrintSize(INVOICE_PRINT_SIZES.A5);
      return;
    }

    setPrintSizeModalOpen(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        if (printAction === "print") {
          const oldStyle = document.getElementById(
            "ame-invoice-print-page-size",
          );

          if (oldStyle) {
            oldStyle.remove();
          }

          const printStyle = document.createElement("style");
          printStyle.id = "ame-invoice-print-page-size";

          const pageSize =
            selectedPrintSize === INVOICE_PRINT_SIZES.A6
              ? "105mm 148mm"
              : "148mm 210mm";

          printStyle.textContent = `
  @media print {
    @page {
      size: ${pageSize};
      margin: 0;
    }
  }
`;

          document.head.appendChild(printStyle);

          const cleanupPrintStyle = () => {
            const style = document.getElementById(
              "ame-invoice-print-page-size",
            );

            if (style) {
              style.remove();
            }
          };

          window.addEventListener("afterprint", cleanupPrintStyle, {
            once: true,
          });

          window.print();
          return;
        }

        if (printAction === "pdf") {
          if (downloadingPdf) {
            return;
          }

          setDownloadingPdf(true);

          try {
            await downloadPdf({
              element: invoiceRef.current,
              filename: `Invoice-${invoice.billNumber}.pdf`,
              paperSize: selectedPrintSize,
            });
          } catch (error) {
            console.error(error);
            alert("Failed to generate PDF");
          } finally {
            setDownloadingPdf(false);
          }
        }
      });
    });
  };

  const handlePrintSizeClose = () => {
    setPrintSizeModalOpen(false);
  };

  const customerName = invoice.customerId?.name || "Cash Customer";
  const isWalkIn = customerName === "Cash Customer";

  return (
    <MainLayout>
      <div className="invoice-container">
        {/* TOOLBAR */}
        <div className="invoice-toolbar no-print">
          <div className="invoice-actions">
            <Button variant="secondary" onClick={handlePrint}>
              Print
            </Button>

            <Button
              variant="secondary"
              loading={downloadingPdf}
              onClick={handleDownloadPdf}
            >
              {downloadingPdf ? "Generating PDF..." : "PDF"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(`/customers/${invoice.customerId?._id}`)}
            >
              Profile
            </Button>

            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>

          <div className="invoice-size-reminder">
            Recommended print size:{" "}
            <strong>{recommendation.recommendedSize}</strong>
            <span>
              {recommendation.itemCount} item
              {recommendation.itemCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* INVOICE DOCUMENT */}
        <div
          ref={invoiceRef}
          className={`invoice-document ${
            isA6 ? "invoice-document-a6" : "invoice-document-a5"
          }`}
          data-paper-size={selectedPrintSize}
        >
          {pages.map((pageItems, pageIndex) => {
            const isLastPage = pageIndex === pages.length - 1;

            return (
              <div
                key={pageIndex}
                className={`invoice-page ${
                  isA6 ? "invoice-page-a6" : "invoice-page-a5"
                }`}
              >
                {/* HEADER */}
                <div className="invoice-header">
                  <div className="invoice-header-grid">
                    <div className="invoice-shop-info">
                      <h2>A M</h2>
                      <p>Pandhurna</p>
                      <p>Mobile: 9074001099</p>
                      <p className="invoice-meta">Date: {invoiceDate}</p>
                      <p className="invoice-meta">
                        Invoice No: {invoice.billNumber}
                      </p>
                    </div>

                    <div className="invoice-customer-info">
                      <p>
                        Customer:{" "}
                        <strong className="customer-name">
                          {customerName}
                        </strong>
                      </p>

                      {!isWalkIn && (
                        <>
                          <p>Mobile: {invoice.customerId?.mobile || ""}</p>
                          <p>Address: {invoice.customerId?.address || ""}</p>
                          <p>Previous Due: ₹{invoice.previousDue || 0}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRODUCT TABLE */}
                <div className="invoice-table-wrapper">
                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th className="col-sno">S.No</th>
                        <th className="col-product">Product</th>
                        <th className="col-qty">Qty</th>
                        <th className="col-unit">Unit</th>
                        <th className="col-rate">Rate</th>
                        <th className="col-amount">Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pageItems.map((item, index) => (
                        <tr
                          key={`${pageIndex}-${index}`}
                          className={!item.productName ? "empty-row" : ""}
                        >
                          <td className="cell-sno">
                            {item.productName
                              ? pageIndex * ITEMS_PER_PAGE + index + 1
                              : ""}
                          </td>
                          <td className="invoice-product-name">
                            {item.productName}
                          </td>
                          <td className="cell-qty">
                            {item.productName ? item.qty : ""}
                          </td>
                          <td className="cell-unit">
                            {item.productName ? formatUnit(item.unitType) : ""}
                          </td>
                          <td className="cell-rate">
                            {item.productName
                              ? new Intl.NumberFormat("en-IN").format(item.rate)
                              : ""}
                          </td>
                          <td className="cell-amount">
                            {item.productName
                              ? new Intl.NumberFormat("en-IN").format(
                                  item.amount,
                                )
                              : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TOTAL */}
                {isLastPage ? (
                  <div className="invoice-total-box">
                    <div>Total Items: {invoice.items.length}</div>
                    <div className="grand-total">
                      Grand Total:{" "}
                      {formatCurrency(
                        invoice.grandTotal ?? invoice.totalAmount,
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="invoice-page-spacer" />
                )}

                {/* FOOTER */}
                <div className="page-footer">
                  Page {pageIndex + 1} of {pages.length}
                </div>
              </div>
            );
          })}
        </div>

        {/* PRINT SIZE MODAL */}
        <InvoicePrintSizeModal
          open={printSizeModalOpen}
          recommendation={recommendation}
          selectedSize={selectedPrintSize}
          onSelectSize={setSelectedPrintSize}
          onConfirm={handlePrintSizeConfirm}
          onClose={handlePrintSizeClose}
          confirmLabel={printAction === "pdf" ? "Generate PDF" : "Print"}
        />
      </div>
    </MainLayout>
  );
}

export default InvoicePage;
