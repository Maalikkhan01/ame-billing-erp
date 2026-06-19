const HoldBill = require("../models/HoldBill");
const Customer = require("../models/Customer");

const createHoldBill = async (req, res) => {
  try {
    const { customerId, items, grandTotal } = req.body;
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

    if (
  typeof grandTotal !== "number" ||
  grandTotal <= 0
) {
  return res.status(400).json({
    success: false,
    message: "Invalid total amount",
  });
}

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required",
      });
    }

    const holdBill = await HoldBill.create({
      customerId,
      customerName: customer.name,
      items,
      grandTotal,
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

    const { customerId, items, grandTotal } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const holdBill = await HoldBill.findById(id);

    if (!holdBill) {
      return res.status(404).json({
        success: false,
        message: "Hold bill not found",
      });
    }

    holdBill.customerId = customerId;
    holdBill.customerName = customer.name;
    holdBill.items = items;
    holdBill.grandTotal = grandTotal;

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
