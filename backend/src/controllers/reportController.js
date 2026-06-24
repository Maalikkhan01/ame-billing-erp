const Bill = require("../models/Bill");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Ledger = require("../models/Ledger");

const dashboardSummary = async (req, res) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const bills = await Bill.find({
      createdAt: {
        $gte: today,
      },
    });

    const totalBills = bills.length;

    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    const payments = await Ledger.find({
      type: "PAYMENT",
      createdAt: {
        $gte: today,
      },
    });

    const totalCollection = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    const totalDue = bills.reduce((sum, bill) => sum + bill.dueAmount, 0);

    const customerCount = await Customer.countDocuments({
      isActive: true,
    });

    const productCount = await Product.countDocuments({
      active: true,
    });
    const outstandingDueResult = await Customer.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalDue: {
            $sum: "$currentDue",
          },
        },
      },
    ]);

    const outstandingDue = outstandingDueResult[0]?.totalDue || 0;
    const recentBills = await Bill.find()
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .populate("customerId", "name");
    const topDueCustomers = await Customer.find({
      currentDue: {
        $gt: 0,
      },
      isActive: true,
    })
      .sort({
        currentDue: -1,
      })
      .limit(5)
      .select("name mobile currentDue");

    res.json({
      success: true,

      summary: {
        totalSales,
        totalCollection,
        totalDue,
        totalBills,
        customerCount,
        productCount,
        outstandingDue,
      },

      recentBills,
      topDueCustomers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const monthlyReport = async (req, res) => {
  try {
    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const bills = await Bill.find({
      createdAt: {
        $gte: firstDay,
      },
    });

    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    const payments = await Ledger.find({
      type: "PAYMENT",
      createdAt: {
        $gte: firstDay,
      },
    });

    const totalCollection = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    const totalDue = bills.reduce((sum, bill) => sum + bill.dueAmount, 0);

    res.json({
      success: true,

      summary: {
        totalSales,
        totalCollection,
        totalDue,
        totalBills: bills.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const dueReport = async (req, res) => {
  try {
    const customers = await Customer.find({
      currentDue: {
        $gt: 0,
      },

      isActive: true,
    }).sort({
      currentDue: -1,
    });

    const totalDue = customers.reduce(
      (sum, customer) => sum + customer.currentDue,
      0,
    );

    res.json({
      success: true,
      totalDue,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRangeReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required",
      });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "fromDate cannot be greater than toDate",
      });
    }

    end.setHours(23, 59, 59, 999);

    const bills = await Bill.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    const payments = await Ledger.find({
      type: "PAYMENT",
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const totalCollection = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    const totalDue = bills.reduce((sum, bill) => sum + bill.dueAmount, 0);

    res.json({
      success: true,
      summary: {
        totalSales,
        totalCollection,
        totalDue,
        totalBills: bills.length,
      },
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
  dashboardSummary,
  dueReport,
  monthlyReport,
  getRangeReport,
};
