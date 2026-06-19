const express = require("express");

const router = express.Router();

const {
  createBill,
  getBills,
  getBillById,
  getBillsByCustomer,
} = require("../controllers/billController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBill);

router.get("/", protect, getBills);
router.get(
  "/customer/:customerId",
  protect,
  getBillsByCustomer
);

router.get(
  "/:id",
  protect,
  getBillById
);
module.exports = router;
