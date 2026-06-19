const Ledger = require("../models/Ledger");
const Customer = require("../models/Customer");

const customerStatement =
  async (req, res) => {

    try {

      const customer =
        await Customer.findById(
          req.params.customerId
        );

      const ledger =
        await Ledger.find({
          customerId:
            req.params.customerId,
        }).sort({
          createdAt: 1,
        });

      res.json({
        success: true,
        customer,
        ledger,
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
  customerStatement,
};