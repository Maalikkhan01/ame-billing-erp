const express = require("express");

const router = express.Router();

const {
  dashboardSummary,
  monthlyReport,
  dueReport,
  getRangeReport,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, dashboardSummary);
router.get("/due", protect, dueReport);
router.get("/monthly", protect, monthlyReport);
router.get("/range", protect, getRangeReport);

module.exports = router;
