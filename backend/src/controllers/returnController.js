const ReturnService = require("../services/returnService");

const createReturn = async (req, res) => {
  try {
    const {
      billId,
      productId,
      qty,
      reason = "Customer Return",
      note = "",
    } = req.body;

    if (!billId || !productId || !qty) {
      return res.status(400).json({
        success: false,
        message: "Bill, Product and Qty are required",
      });
    }

    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid return quantity",
      });
    }

    const result = await ReturnService.processReturn({
      billId,
      productId,
      qty,
      reason,
      note,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: "Return completed successfully",
      returnedAmount: result.returnAmount,
      currentDue: result.currentDue,
      bill: result.bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReturn,
};
