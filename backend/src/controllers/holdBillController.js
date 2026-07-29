const HoldBill = require("../models/HoldBill");
const Customer = require("../models/Customer");

const {
  validateRate,
  validateQuantity,
  calculateLineAmount,
  calculateSubtotal,
  calculateGrandTotal,
  calculateRoundOff,
} = require("../utils/accounting");

const createHoldBill = async (req, res) => {
  try {
    const { customerId, items } = req.body;
    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const processedItems = [];

    for (const item of items) {
      const qty = validateQuantity(item.qty);

      const rate = validateRate(item.rate);

      const amount = calculateLineAmount(rate, qty);

      processedItems.push({
        ...item,
        qty,
        rate,
        amount,
      });
    }

    const subtotal = calculateSubtotal(processedItems);

    const grandTotal = calculateGrandTotal(subtotal);

    const roundOff = calculateRoundOff(subtotal, grandTotal);

    const holdBill = await HoldBill.create({
      customerId,
      customerName: customer.name,
      items: processedItems,

      subtotal,
      roundOff,
      grandTotal,
      totalAmount: grandTotal,
    });

    res.status(201).json({
      success: true,
      holdBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateHoldBill = async (req, res) => {
  try {
    const { id } = req.params;

    const { customerId, items } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const processedItems = [];

    for (const item of items) {
      const qty = validateQuantity(item.qty);

      const rate = validateRate(item.rate);

      const amount = calculateLineAmount(rate, qty);

      processedItems.push({
        ...item,
        qty,
        rate,
        amount,
      });
    }

    const subtotal = calculateSubtotal(processedItems);

    const grandTotal = calculateGrandTotal(subtotal);

    const roundOff = calculateRoundOff(subtotal, grandTotal);

    const holdBill = await HoldBill.findById(id);

    if (!holdBill) {
      return res.status(404).json({
        success: false,
        message: "Hold bill not found",
      });
    }

    holdBill.customerId = customerId;
    holdBill.customerName = customer.name;
    holdBill.items = processedItems;

    holdBill.subtotal = subtotal;

    holdBill.roundOff = roundOff;

    holdBill.grandTotal = grandTotal;

    holdBill.totalAmount = grandTotal;

    await holdBill.save();

    res.json({
      success: true,
      holdBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHoldBills = async (req, res) => {
  try {
    const holdBills = await HoldBill.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      holdBills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHoldBillById = async (req, res) => {
  try {
    const holdBill = await HoldBill.findById(req.params.id);

    if (!holdBill) {
      return res.status(404).json({
        success: false,
        message: "Hold bill not found",
      });
    }

    res.json({
      success: true,
      holdBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteHoldBill = async (req, res) => {
  try {
    const holdBill = await HoldBill.findById(req.params.id);

    if (!holdBill) {
      return res.status(404).json({
        success: false,
        message: "Hold bill not found",
      });
    }

    await holdBill.deleteOne();

    res.json({
      success: true,
      message: "Hold bill deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createHoldBill,
  updateHoldBill,
  getHoldBills,
  getHoldBillById,
  deleteHoldBill,
};
