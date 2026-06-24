const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getActivityLogs,
  getLoginHistory,
} = require("../controllers/activityController");

router.get(
  "/activity-logs",
  protect,
  getActivityLogs
);

router.get(
  "/login-history",
  protect,
  getLoginHistory
);

module.exports = router;