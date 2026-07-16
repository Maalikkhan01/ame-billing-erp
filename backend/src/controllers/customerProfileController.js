const Customer = require("../models/Customer");
const Bill = require("../models/Bill");
const Ledger = require("../models/Ledger");

const getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const bills = await Bill.find({
      customerId,
    }).sort({
      createdAt: -1,
    });

    const ledger = await Ledger.find({
      customerId,
    }).sort({
      createdAt: 1,
    });

    const totalSale = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    const totalPayment = ledger
      .filter((entry) => entry.type === "PAYMENT")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalReturn = ledger
      .filter((entry) => entry.type === "SALE_RETURN")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalAdjustment = ledger
      .filter((entry) => entry.type === "ADJUSTMENT")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalBills = bills.length;

    const highestBill =
      bills.length > 0 ? Math.max(...bills.map((bill) => bill.totalAmount)) : 0;

    const lastPurchase = bills.length > 0 ? bills[0].createdAt : null;

    res.json({
      success: true,

      customer,

      summary: {
        totalBills,

        totalSale,

        totalPayment,

        totalReturn,

        totalAdjustment,

        currentDue: customer.currentDue,

        highestBill,

        lastPurchase,
      },

      bills,

      ledger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCustomerProfile,
};
