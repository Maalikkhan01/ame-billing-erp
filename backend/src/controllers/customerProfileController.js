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
    const totalBills = bills.length;

    const highestBill =
      bills.length > 0 ? Math.max(...bills.map((bill) => bill.totalAmount)) : 0;

    const averageBill =
      bills.length > 0
        ? Math.round(
            bills.reduce((sum, bill) => sum + bill.totalAmount, 0) /
              bills.length,
          )
        : 0;

    const lastPurchase = bills.length > 0 ? bills[0].createdAt : null;

    res.json({
      success: true,

      customer,

      summary: {
        totalBills,

        totalSale,

        currentDue: customer.currentDue,

        highestBill,

        averageBill,

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
