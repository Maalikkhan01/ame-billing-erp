const Ledger = require("../models/Ledger");

class LedgerService {
  /**
   * Generic Ledger Entry Creator
   */
  static async createEntry({
    customerId,
    billId = null,
    type,
    amount,
    paymentMode = "CASH",
    transactionReason = "",
    referenceType = "MANUAL",
    referenceId = null,
    note = "",
    balanceAfter = 0,
    createdBy,
  }) {
    return await Ledger.create({
      customerId,
      billId,
      type,
      amount,
      paymentMode,
      transactionReason,
      referenceType,
      referenceId,
      note,
      balanceAfter,
      createdBy,
    });
  }

  /**
   * Sale Entry
   */
  static async createSaleEntry({
    customerId,
    billId,
    amount,
    balanceAfter,
    createdBy,
  }) {
    return this.createEntry({
      customerId,
      billId,
      type: "SALE",
      amount,
      referenceType: "BILL",
      referenceId: billId,
      balanceAfter,
      createdBy,
    });
  }

  /**
   * Payment Entry
   */
  static async createPaymentEntry({
    customerId,
    amount,
    paymentMode = "CASH",
    note = "",
    balanceAfter,
    createdBy,
  }) {
    return this.createEntry({
      customerId,
      type: "PAYMENT",
      amount,
      paymentMode,
      note,
      referenceType: "PAYMENT",
      balanceAfter,
      createdBy,
    });
  }

  /**
   * Adjustment Entry
   */
  static async createAdjustmentEntry({
    customerId,
    amount,
    reason,
    note = "",
    balanceAfter,
    createdBy,
  }) {
    return this.createEntry({
      customerId,
      type: "ADJUSTMENT",
      amount,
      transactionReason: reason,
      note,
      referenceType: "ADJUSTMENT",
      balanceAfter,
      createdBy,
    });
  }

  /**
   * Sales Return Entry
   */
  static async createSaleReturnEntry({
    customerId,
    billId,
    amount,
    reason,
    note = "",
    balanceAfter,
    createdBy,
  }) {
    return this.createEntry({
      customerId,
      billId,
      type: "SALE_RETURN",
      amount,
      transactionReason: reason,
      referenceType: "SALE_RETURN",
      referenceId: billId,
      note,
      balanceAfter,
      createdBy,
    });
  }

  /**
   * Credit Note
   */
  static async createCreditNoteEntry({
    customerId,
    amount,
    note = "",
    balanceAfter,
    createdBy,
  }) {
    return this.createEntry({
      customerId,
      type: "CREDIT_NOTE",
      amount,
      note,
      referenceType: "CREDIT_NOTE",
      balanceAfter,
      createdBy,
    });
  }

  /**
   * Cancel Bill Entry
   */
  static async createCancelledBillEntry({
    customerId,
    billId,
    amount,
    reason,
    balanceAfter,
    createdBy,
  }) {
    return this.createEntry({
      customerId,
      billId,
      type: "CANCELLED_BILL",
      amount,
      transactionReason: reason,
      referenceType: "BILL",
      referenceId: billId,
      balanceAfter,
      createdBy,
    });
  }
}

module.exports = LedgerService;
