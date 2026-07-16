const Bill = require("../models/Bill");
const Customer = require("../models/Customer");
const LedgerService = require("./ledgerService");

class CancelBillService {
  static async cancelBill({ billId, reason = "Bill Cancelled", createdBy }) {
    const bill = await Bill.findById(billId);

    if (!bill) {
      throw new Error("Bill not found");
    }

    if (bill.status === "CANCELLED") {
      throw new Error("Bill already cancelled");
    }

    if (bill.status === "PARTIAL_RETURN" || bill.status === "FULL_RETURN") {
      throw new Error("Returned bill cannot be cancelled");
    }

    const customer = await Customer.findById(bill.customerId);

    customer.currentDue -= bill.dueAmount;

    if (customer.currentDue < 0) {
      customer.currentDue = 0;
    }

    await customer.save();

    bill.status = "CANCELLED";
    bill.cancelReason = reason;

    await bill.save();

    await LedgerService.createCancelledBillEntry({
      customerId: customer._id,
      billId: bill._id,
      amount: bill.dueAmount,
      reason,
      balanceAfter: customer.currentDue,
      createdBy,
    });

    return {
      bill,
      currentDue: customer.currentDue,
    };
  }
}

module.exports = CancelBillService;
