const Customer = require("../models/Customer");
const LedgerService = require("../services/ledgerService");

const createAdjustment = async (req, res) => {
  try {
    const { customerId, amount, reason, note = "" } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer is required",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid adjustment amount",
      });
    }

    if (!reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reason is required",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (amount > customer.currentDue) {
      return res.status(400).json({
        success: false,
        message: "Adjustment exceeds current due",
      });
    }

    customer.currentDue -= amount;

    await customer.save();

    await LedgerService.createAdjustmentEntry({
      customerId: customer._id,
      amount,
      reason,
      note,
      balanceAfter: customer.currentDue,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: "Adjustment saved successfully",
      currentDue: customer.currentDue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAdjustment,
};
