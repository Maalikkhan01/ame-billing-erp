const express = require("express");

const router = express.Router();

const { createAdjustment } = require("../controllers/adjustmentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createAdjustment);

module.exports = router;
