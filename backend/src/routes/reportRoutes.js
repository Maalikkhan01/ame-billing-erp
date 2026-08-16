const express = require("express");

const router = express.Router();

const {
  dashboardSummary,
  monthlyReport,
  dueReport,
  getRangeReport,
  getPaymentReport,
  getProfitReport,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, dashboardSummary);
router.get("/due", protect, dueReport);
router.get("/monthly", protect, monthlyReport);
router.get("/range", protect, getRangeReport);
router.get("/payments", protect, getPaymentReport);
router.get("/profit", protect, getProfitReport);

module.exports = router;
