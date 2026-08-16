import Button from "../ui/Button";

import {
  A6_MAX_ITEMS,
  INVOICE_PRINT_SIZES,
} from "../../utils/invoicePrintSize";

import "./InvoicePrintSizeModal.css";

function InvoicePrintSizeModal({
  open,
  recommendation,
  selectedSize,
  onSelectSize,
  onConfirm,
  onClose,
  confirmLabel = "Continue",
}) {
  if (!open || !recommendation) {
    return null;
  }

  const { recommendedSize, itemCount, canUseA6, reason } = recommendation;

  const isRecommendedA6 = recommendedSize === INVOICE_PRINT_SIZES.A6;

  const isA6Selected = selectedSize === INVOICE_PRINT_SIZES.A6;

  const isA5Selected = selectedSize === INVOICE_PRINT_SIZES.A5;

  /*
   * A6 is selectable only when the invoice
   * is within the A6 item limit.
   */
  const handleA6Select = () => {
    if (!canUseA6) {
      return;
    }

    onSelectSize(INVOICE_PRINT_SIZES.A6);
  };

  return (
    <div
      className="invoice-print-size-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-print-size-title"
    >
      <div className="invoice-print-size-modal">
        {/* HEADER */}
        <div className="invoice-print-size-header">
          <h2 id="invoice-print-size-title">Print Invoice</h2>

          <button
            type="button"
            className="invoice-print-size-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="invoice-print-size-body">
          {/* RECOMMENDATION */}
          <div
            className={`invoice-print-size-status ${
              isRecommendedA6 ? "is-a6" : "is-a5"
            }`}
          >
            <div className="invoice-print-size-status-title">
              Recommended Size: {recommendedSize}
            </div>

            <div className="invoice-print-size-status-text">{reason}</div>
          </div>

          {/* ITEM COUNT */}
          <div className="invoice-print-size-items">
            <strong>Items:</strong> {itemCount}
          </div>

          {/* SIZE OPTIONS */}
          <div className="invoice-print-size-options">
            {/* A6 */}
            <button
              type="button"
              className={`invoice-print-size-option ${
                isA6Selected ? "selected" : ""
              } ${!canUseA6 ? "disabled" : ""}`}
              onClick={handleA6Select}
              disabled={!canUseA6}
              aria-disabled={!canUseA6}
            >
              <span className="invoice-print-size-option-title">A6</span>

              <span className="invoice-print-size-option-description">
                Compact invoice
              </span>

              {canUseA6 ? (
                <span className="invoice-print-size-option-info">
                  Up to {A6_MAX_ITEMS} items
                </span>
              ) : (
                <span className="invoice-print-size-option-warning">
                  Not available above {A6_MAX_ITEMS} items
                </span>
              )}
            </button>

            {/* A5 */}
            <button
              type="button"
              className={`invoice-print-size-option ${
                isA5Selected ? "selected" : ""
              }`}
              onClick={() => onSelectSize(INVOICE_PRINT_SIZES.A5)}
            >
              <span className="invoice-print-size-option-title">A5</span>

              <span className="invoice-print-size-option-description">
                Standard / large invoice
              </span>

              <span className="invoice-print-size-option-info">
                Suitable for larger bills
              </span>
            </button>
          </div>

          {/* A6 LIMIT WARNING */}
          {!canUseA6 && (
            <div className="invoice-print-size-warning">
              <strong>A6 cannot be used for this invoice.</strong>
              <br />
              This invoice contains {itemCount} items. A6 supports a maximum of{" "}
              {A6_MAX_ITEMS} items. Please use A5.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="invoice-print-size-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={!selectedSize}
          >
            {confirmLabel} {selectedSize}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InvoicePrintSizeModal;
