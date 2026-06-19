const Customer = require("../models/Customer");
const Ledger = require("../models/Ledger");

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

    customer.currentDue -= amount;

    if (customer.currentDue < 0) {
      customer.currentDue = 0;
    }

    await customer.save();

    const entry = await Ledger.create({
      customerId,
      type: "PAYMENT",
      amount,
      note,
      paymentMode,
      balanceAfter: customer.currentDue,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      entry,
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
