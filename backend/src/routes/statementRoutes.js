const express = require("express");

const router =
  express.Router();

const {
  customerStatement,
} = require(
  "../controllers/statementController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.get(
  "/:customerId",
  protect,
  customerStatement
);

module.exports = router;