const express = require("express");

const router = express.Router();

const { cancelBill } = require("../controllers/cancelBillController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, cancelBill);

module.exports = router;
