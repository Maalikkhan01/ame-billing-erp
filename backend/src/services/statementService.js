const Customer = require("../models/Customer");
const Ledger = require("../models/Ledger");

class StatementService {
  static async getCustomerStatement(customerId) {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const ledger = await Ledger.find({
      customerId,
    }).sort({
      createdAt: 1,
    });

    let runningBalance = 0;

    const transactions = ledger.map((entry) => {
      switch (entry.type) {
        case "SALE":
          runningBalance += entry.amount;
          break;

        case "PAYMENT":
        case "SALE_RETURN":
        case "ADJUSTMENT":
        case "CANCELLED_BILL":
          runningBalance -= entry.amount;
          break;

        default:
          break;
      }

      return {
        _id: entry._id,
        date: entry.createdAt,
        type: entry.type,
        amount: entry.amount,
        reason: entry.transactionReason,
        note: entry.note,
        paymentMode: entry.paymentMode,
        balance: runningBalance,
      };
    });

    return {
      customer,
      currentDue: customer.currentDue,
      transactions,
    };
  }
}

module.exports = StatementService;
