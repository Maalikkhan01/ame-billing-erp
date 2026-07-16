const Customer = require("../models/Customer");
const Ledger = require("../models/Ledger");

/**
 * Transaction types that increase customer due
 */
const DEBIT_TYPES = ["SALE", "REFUND", "OPENING_BALANCE", "DEBIT_NOTE"];

/**
 * Transaction types that decrease customer due
 */
const CREDIT_TYPES = [
  "PAYMENT",
  "SALE_RETURN",
  "ADJUSTMENT",
  "CREDIT_NOTE",
  "WRITE_OFF",
  "CANCELLED_BILL",
];

/**
 * Calculate customer balance from ledger
 */
const calculateCustomerBalance = async (customerId) => {
  const entries = await Ledger.find({ customerId }).lean();

  let balance = 0;

  for (const entry of entries) {
    if (DEBIT_TYPES.includes(entry.type)) {
      balance += entry.amount;
    } else if (CREDIT_TYPES.includes(entry.type)) {
      balance -= entry.amount;
    }
  }

  return Math.max(balance, 0);
};

/**
 * Update customer.currentDue from ledger
 */
const refreshCustomerBalance = async (customerId) => {
  const balance = await calculateCustomerBalance(customerId);

  await Customer.findByIdAndUpdate(customerId, {
    currentDue: balance,
  });

  /**
   * Update latest ledger balanceAfter
   */

  const latestEntry = await Ledger.findOne({
    customerId,
  }).sort({
    createdAt: -1,
  });

  if (latestEntry) {
    latestEntry.balanceAfter = balance;
    await latestEntry.save();
  }

  return balance;
};

/**
 * Get customer balance
 */
const getCustomerBalance = async (customerId) => {
  const customer = await Customer.findById(customerId).select("currentDue");

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer.currentDue;
};

module.exports = {
  calculateCustomerBalance,
  refreshCustomerBalance,
  getCustomerBalance,
};
