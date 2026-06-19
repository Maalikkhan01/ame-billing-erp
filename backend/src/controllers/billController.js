const Bill = require("../models/Bill");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Ledger = require("../models/Ledger");

const generateBillNumber = require("../utils/generateBillNumber");

const createBill = async (req, res) => {
  try {
    const { customerId, items, paidAmount = 0 } = req.body;
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

    if (paidAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid paid amount",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    let totalAmount = 0;

    const processedItems = [];
    if (items.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Too many items in bill",
      });
    }
    for (const item of items) {
      if (!item.productId) {
        return res.status(400).json({
          success: false,
          message: "Product is required",
        });
      }

      if (!item.qty || item.qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity",
        });
      }

      if (!item.unitType) {
        return res.status(400).json({
          success: false,
          message: "Unit type required",
        });
      }
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      let rate = Number(item.rate);

      if (rate > 0) {
        // Frontend edited rate use karo
      } else if (item.unitType === "PIECE") {
        rate = product.piecePrice;
      } else if (item.unitType === "BOX" || item.unitType === "BAG") {
        if (!product.hasPacking) {
          return res.status(400).json({
            success: false,
            message: `${product.name} has no packing`,
          });
        }

        rate = product.packingPrice;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid unit type",
        });
      }

      const amount = item.qty * rate;

      totalAmount += amount;

      processedItems.push({
        productId: product._id,

        productName: product.name,

        unitType: item.unitType,

        qty: item.qty,

        rate,

        amount,
      });
    }

    const dueAmount = totalAmount - paidAmount;

    let paymentType = "FULL";

    if (paidAmount === 0) {
      paymentType = "DUE";
    } else if (dueAmount > 0) {
      paymentType = "PARTIAL";
    }

    if (paidAmount > totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot exceed bill amount",
      });
    }

    const billNumber = await generateBillNumber();
    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid bill amount",
      });
    }
    const bill = await Bill.create({
      billNumber,
      customerId,
      items: processedItems,

      totalAmount,
      paidAmount,
      dueAmount,
      paymentType,

      createdBy: req.user._id,
    });

    customer.currentDue += dueAmount;

    await customer.save();

    await Ledger.create({
      customerId,
      billId: bill._id,
      type: "SALE",
      amount: totalAmount,
      balanceAfter: customer.currentDue,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getBills = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = 20;

    const skip = (page - 1) * limit;

    const keyword = req.query.keyword?.trim() || "";

    let query = {};

    if (keyword) {
      const matchedCustomers = await Customer.find({
        isActive: true,
        $or: [
          {
            name: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            mobile: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      }).select("_id");

      const customerIds = matchedCustomers.map((customer) => customer._id);

      query = {
        $or: [
          {
            billNumber: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            customerId: {
              $in: customerIds,
            },
          },
        ],
      };
    }

    const bills = await Bill.find(query)
      .populate("customerId", "name mobile")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await Bill.countDocuments(query);

    res.json({
      success: true,
      bills,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate("customerId");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.json({
      success: true,
      bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBillsByCustomer = async (req, res) => {
  try {
    const bills = await Bill.find({
      customerId: req.params.customerId,
    })
      .sort({
        createdAt: -1,
      })
      .populate("customerId", "name mobile");

    res.json({
      success: true,
      bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createBill,
  getBills,
  getBillById,
  getBillsByCustomer,
};
