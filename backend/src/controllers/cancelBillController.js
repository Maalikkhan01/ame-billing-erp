const CancelBillService = require("../services/cancelBillService");

const cancelBill = async (req, res) => {
  try {
    const { billId, reason = "Bill Cancelled" } = req.body;

    if (!billId) {
      return res.status(400).json({
        success: false,
        message: "Bill is required",
      });
    }

    const result = await CancelBillService.cancelBill({
      billId,
      reason,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: "Bill cancelled successfully",
      bill: result.bill,
      currentDue: result.currentDue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  cancelBill,
};
