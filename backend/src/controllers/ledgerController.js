const Ledger = require("../models/Ledger");

const getCustomerLedger =
  async (req, res) => {

    try {

      const entries =
        await Ledger.find({
          customerId:
            req.params.customerId,
        })
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        entries,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

module.exports = {
  getCustomerLedger,
};