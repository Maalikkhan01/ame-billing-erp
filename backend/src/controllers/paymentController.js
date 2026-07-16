const Customer = require("../models/Customer");
const LedgerService = require("../services/ledgerService");
const CustomerBalanceService = require("../services/customerBalanceService");

const receivePayment = async (req, res) => {
  try {
    const { customerId, amount, note, paymentMode = "CASH" } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    if (amount > customer.currentDue) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds customer due",
      });
    }

    const entry = await LedgerService.createPaymentEntry({
      customerId,
      amount,
      paymentMode,
      note,
      balanceAfter: undefined,
      createdBy: req.user._id,
    });

    await CustomerBalanceService.refreshCustomerBalance(customerId);

    const currentDue =
      await CustomerBalanceService.getCustomerBalance(customerId);

    res.json({
      success: true,
      entry,
      currentDue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  receivePayment,
};
