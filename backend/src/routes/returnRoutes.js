const express = require("express");

const router = express.Router();

const { createReturn } = require("../controllers/returnController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReturn);

module.exports = router;
