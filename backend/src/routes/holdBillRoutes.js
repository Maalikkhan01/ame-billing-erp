const express = require("express");

const router = express.Router();

const {
  createHoldBill,
  getHoldBills,
  getHoldBillById,
  updateHoldBill,
  deleteHoldBill,
} = require("../controllers/holdBillController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createHoldBill);

router.get("/", protect, getHoldBills);

router.get("/:id", protect, getHoldBillById);

router.put("/:id", protect, updateHoldBill);

router.delete("/:id", protect, deleteHoldBill);

module.exports = router;
