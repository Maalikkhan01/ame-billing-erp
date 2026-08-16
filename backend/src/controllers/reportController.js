const Bill = require("../models/Bill");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Ledger = require("../models/Ledger");

const dashboardSummary = async (req, res) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bills = await Bill.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
      status: "ACTIVE",
    })
      .populate("customerId", "name mobile")
      .lean();

    // --------------------------------------------------
    // Basic Sales
    // --------------------------------------------------

    const totalBills = bills.length;

    let totalSales = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let totalProfitQuantity = 0;

    // --------------------------------------------------
    // Product Aggregation
    // --------------------------------------------------

    const sellingProductMap = new Map();
    const profitableProductMap = new Map();

    // --------------------------------------------------
    // Customer Due
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Process Bills
    // --------------------------------------------------

    for (const bill of bills) {
      for (const item of bill.items || []) {
        const quantity = Number(item.qty || 0);
        const sales = Number(item.amount || 0);

        // Today's total sales
        totalSales += sales;

        // ----------------------------------------------
        // Top Selling Products
        // ----------------------------------------------

        const productId = item.productId?.toString();

        if (productId) {
          if (!sellingProductMap.has(productId)) {
            sellingProductMap.set(productId, {
              productId,
              productName: item.productName || "Unknown Product",
              quantity: 0,
              sales: 0,
            });
          }

          const sellingProduct = sellingProductMap.get(productId);

          sellingProduct.quantity += quantity;
          sellingProduct.sales += sales;
        }

        // ----------------------------------------------
        // Profit Calculation
        //
        // IMPORTANT:
        // Cost <= 0 means cost is not defined.
        // Such products are excluded from profit.
        // ----------------------------------------------

        const costPrice = Number(item.costPrice || 0);

        if (costPrice <= 0) {
          continue;
        }

        const cost = costPrice * quantity;

        const profit = Number(
          item.totalProfit ?? item.profitPerUnit * quantity ?? sales - cost,
        );

        totalCost += cost;
        totalProfit += profit;
        totalProfitQuantity += quantity;

        // ----------------------------------------------
        // Top Profitable Products
        // ----------------------------------------------

        if (productId) {
          if (!profitableProductMap.has(productId)) {
            profitableProductMap.set(productId, {
              productId,
              productName: item.productName || "Unknown Product",
              sales: 0,
              cost: 0,
              profit: 0,
            });
          }

          const profitableProduct = profitableProductMap.get(productId);

          profitableProduct.sales += sales;
          profitableProduct.cost += cost;
          profitableProduct.profit += profit;
        }
      }
    }

    // --------------------------------------------------
    // Today's Collection
    // --------------------------------------------------

    const payments = await Ledger.find({
      type: "PAYMENT",
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("customerId", "name mobile")
      .lean();

    const totalCollection = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );

    // --------------------------------------------------
    // Collection by Payment Mode
    // --------------------------------------------------

    const collectionByMode = {
      CASH: 0,
      UPI: 0,
      BANK: 0,
    };

    for (const payment of payments) {
      const mode = payment.paymentMode || "CASH";

      if (collectionByMode[mode] !== undefined) {
        collectionByMode[mode] += Number(payment.amount || 0);
      }
    }

    // --------------------------------------------------
    // Today's Due Sale
    // --------------------------------------------------

    const totalDue = bills.reduce(
      (sum, bill) => sum + Number(bill.dueAmount || 0),
      0,
    );

    // --------------------------------------------------
    // Profit Margin
    // --------------------------------------------------

    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    // --------------------------------------------------
    // Top Selling Products
    // --------------------------------------------------

    const topSellingProducts = Array.from(sellingProductMap.values())
      .sort((a, b) => {
        if (b.quantity !== a.quantity) {
          return b.quantity - a.quantity;
        }

        return b.sales - a.sales;
      })
      .slice(0, 5);

    // --------------------------------------------------
    // Top Profitable Products
    // --------------------------------------------------

    const topProfitableProducts = Array.from(profitableProductMap.values())
      .map((product) => ({
        ...product,
        margin: product.sales > 0 ? (product.profit / product.sales) * 100 : 0,
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);

    // --------------------------------------------------
    // Recent Bills
    // --------------------------------------------------

    const recentBills = await Bill.find()
      .populate("customerId", "name")
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .lean();

    // --------------------------------------------------
    // Top Due Customers
    // --------------------------------------------------

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
      .select("name mobile currentDue")
      .lean();

    res.json({
      success: true,

      summary: {
        totalSales,
        totalCost,
        totalProfit,
        profitMargin,
        totalCollection,
        totalBills,
        totalDue,
        outstandingDue,

        // Existing fields retained for compatibility
        customerCount,
        productCount,
      },

      recentBills,

      topDueCustomers,

      topSellingProducts,

      topProfitableProducts,

      collectionByMode,
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

    const totalSales = bills.reduce(
      (sum, bill) => sum + (bill.grandTotal ?? bill.totalAmount),
      0,
    );

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

    const totalSales = bills.reduce(
      (sum, bill) => sum + (bill.grandTotal ?? bill.totalAmount),
      0,
    );

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

const getPaymentReport = async (req, res) => {
  try {
    const { date } = req.query;

    let start;
    let end;

    if (date) {
      start = new Date(`${date}T00:00:00`);
      end = new Date(`${date}T23:59:59.999`);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }
    } else {
      start = new Date();
      start.setHours(0, 0, 0, 0);

      end = new Date();
      end.setHours(23, 59, 59, 999);
    }

    const payments = await Ledger.find({
      type: "PAYMENT",
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({
        createdAt: -1,
      })
      .populate("customerId", "name mobile")
      .lean();

    const totalReceived = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );

    const uniqueCustomerIds = new Set(
      payments
        .map((payment) => payment.customerId?._id?.toString())
        .filter(Boolean),
    );

    const customersPaid = uniqueCustomerIds.size;

    const formattedPayments = payments.map((payment) => ({
      _id: payment._id,

      createdAt: payment.createdAt,

      customerId: payment.customerId
        ? {
            _id: payment.customerId._id,
            name: payment.customerId.name,
            mobile: payment.customerId.mobile,
          }
        : {
            _id: null,
            name: "Unknown Customer",
            mobile: "",
          },

      amount: Number(payment.amount || 0),

      paymentMode: payment.paymentMode || "CASH",

      note: payment.note || "",
    }));

    res.json({
      success: true,

      summary: {
        customersPaid,
        totalReceived,
        totalPayments: formattedPayments.length,
      },

      payments: formattedPayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfitReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    let start;
    let end;

    // Custom date range
    if (fromDate || toDate) {
      if (!fromDate || !toDate) {
        return res.status(400).json({
          success: false,
          message: "fromDate and toDate are required",
        });
      }

      start = new Date(`${fromDate}T00:00:00`);
      end = new Date(`${toDate}T23:59:59.999`);

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
    } else {
      // Default: Today
      start = new Date();
      start.setHours(0, 0, 0, 0);

      end = new Date();
      end.setHours(23, 59, 59, 999);
    }

    const bills = await Bill.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
      status: "ACTIVE",
    })
      .populate("customerId", "name mobile")
      .lean();

    let totalSales = 0;
    let totalCost = 0;
    let grossProfit = 0;
    let totalQuantity = 0;

    const productMap = new Map();
    const customerMap = new Map();

    // Bills that contain at least one product with a valid cost price
    let profitBillCount = 0;

    for (const bill of bills) {
      const customerId = bill.customerId?._id?.toString();

      let billHasProfitItem = false;

      for (const item of bill.items || []) {
        const quantity = Number(item.qty || 0);
        const sales = Number(item.amount || 0);
        const costPrice = Number(item.costPrice || 0);

        // --------------------------------------------------
        // IMPORTANT:
        // Product without cost price is NOT a profit item.
        // Do not include it anywhere in the profit report.
        // --------------------------------------------------
        if (costPrice <= 0) {
          continue;
        }

        const cost = costPrice * quantity;

        // Historical profit saved at billing time
        const profit = Number(
          item.totalProfit ?? item.profitPerUnit * quantity ?? sales - cost,
        );

        totalSales += sales;
        totalCost += cost;
        grossProfit += profit;
        totalQuantity += quantity;

        billHasProfitItem = true;

        // -----------------------------
        // Product-wise aggregation
        // -----------------------------

        const productId = item.productId?.toString();

        if (productId) {
          if (!productMap.has(productId)) {
            productMap.set(productId, {
              productId,
              productName: item.productName || "Unknown Product",
              quantity: 0,
              sales: 0,
              cost: 0,
              profit: 0,
            });
          }

          const product = productMap.get(productId);

          product.quantity += quantity;
          product.sales += sales;
          product.cost += cost;
          product.profit += profit;
        }

        // -----------------------------
        // Customer-wise aggregation
        // -----------------------------

        if (customerId) {
          if (!customerMap.has(customerId)) {
            customerMap.set(customerId, {
              customerId,
              customerName: bill.customerId?.name || "Unknown Customer",
              mobile: bill.customerId?.mobile || "",
              sales: 0,
              cost: 0,
              profit: 0,
            });
          }

          const customer = customerMap.get(customerId);

          customer.sales += sales;
          customer.cost += cost;
          customer.profit += profit;
        }
      }

      if (billHasProfitItem) {
        profitBillCount++;
      }
    }

    const calculateMargin = (sales, profit) => {
      if (!sales || sales <= 0) {
        return 0;
      }

      return (profit / sales) * 100;
    };

    const products = Array.from(productMap.values()).map((product) => ({
      ...product,
      margin: calculateMargin(product.sales, product.profit),
    }));

    const customers = Array.from(customerMap.values()).map((customer) => ({
      ...customer,
      margin: calculateMargin(customer.sales, customer.profit),
    }));

    // Highest profit first
    products.sort((a, b) => b.profit - a.profit);
    customers.sort((a, b) => b.profit - a.profit);

    const profitMargin = calculateMargin(totalSales, grossProfit);

    res.json({
      success: true,

      filters: {
        fromDate: start,
        toDate: end,
      },

      summary: {
        totalSales,
        totalCost,
        grossProfit,
        profitMargin,
        totalBills: profitBillCount,
        totalQuantity,
      },

      products,
      customers,
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
  getPaymentReport,
  getRangeReport,
  getProfitReport,
};
