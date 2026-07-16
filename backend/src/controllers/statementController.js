const StatementService = require("../services/statementService");

const customerStatement = async (req, res) => {
  try {
    const result = await StatementService.getCustomerStatement(
      req.params.customerId,
    );

    res.json({
      success: true,
      customer: result.customer,
      currentDue: result.currentDue,
      transactions: result.transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  customerStatement,
};
