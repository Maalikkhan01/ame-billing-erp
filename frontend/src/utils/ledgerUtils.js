/**
 * ==========================================================
 * Ledger Labels
 * ==========================================================
 */

export const getLedgerLabel = (type) => {
  switch (type) {
    case "SALE":
      return "Invoice Sale";

    case "PAYMENT":
      return "Payment Received";

    case "SALE_RETURN":
      return "Product Return";

    case "ADJUSTMENT":
      return "Adjustment";

    case "CANCELLED_BILL":
      return "Cancelled Bill";

    case "CREDIT_NOTE":
      return "Credit Note";

    case "DEBIT_NOTE":
      return "Debit Note";

    case "OPENING_BALANCE":
      return "Opening Balance";

    case "WRITE_OFF":
      return "Write Off";

    case "REFUND":
      return "Refund";

    default:
      return type;
  }
};

/**
 * ==========================================================
 * Ledger Colors
 * ==========================================================
 */

export const getLedgerColor = (type) => {
  switch (type) {
    case "SALE":
      return "ledger-sale";

    case "PAYMENT":
      return "ledger-payment";

    case "SALE_RETURN":
      return "ledger-return";

    case "ADJUSTMENT":
      return "ledger-adjustment";

    case "CANCELLED_BILL":
      return "ledger-cancelled";

    case "CREDIT_NOTE":
      return "ledger-credit";

    case "DEBIT_NOTE":
      return "ledger-debit";

    case "OPENING_BALANCE":
      return "ledger-opening";

    case "WRITE_OFF":
      return "ledger-writeoff";

    case "REFUND":
      return "ledger-refund";

    default:
      return "ledger-default";
  }
};

/**
 * ==========================================================
 * Payment Mode Classes
 * ==========================================================
 */

export const getPaymentModeClass = (mode) => {
  switch (mode) {
    case "CASH":
      return "mode-cash";

    case "UPI":
      return "mode-upi";

    case "BANK":
      return "mode-bank";

    default:
      return "mode-default";
  }
};
