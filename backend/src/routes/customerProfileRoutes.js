const express = require("express");

const router = express.Router();

const {
  getCustomerProfile,
} = require(
  "../controllers/customerProfileController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.get(
  "/:id",
  protect,
  getCustomerProfile
);

module.exports = router;