const express = require("express");

const router = express.Router();

const { receivePayment } = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/receive", protect, receivePayment);

module.exports = router;
