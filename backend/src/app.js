const express = require("express");
const cors = require("cors");
const allowedOrigins = [process.env.FRONTEND_URL];
const helmet = require("helmet");
const morgan = require("morgan");

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const backupRoutes = require("./routes/backupRoutes");
const restoreRoutes = require("./routes/restoreRoutes");
const customerRoutes = require("./routes/customerRoutes");
const customerProfileRoutes = require("./routes/customerProfileRoutes");
const productRoutes = require("./routes/productRoutes");
const billRoutes = require("./routes/billRoutes");
const holdBillRoutes = require("./routes/holdBillRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const statementRoutes = require("./routes/statementRoutes");
const userRoutes = require("./routes/userRoutes");
const activityRoutes = require("./routes/activityRoutes");
const securityRoutes = require("./routes/securityRoutes");
const returnRoutes = require("./routes/returnRoutes");
const adjustmentRoutes = require("./routes/adjustmentRoutes");
const cancelBillRoutes = require("./routes/cancelBillRoutes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AME Billing API Running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/restore", restoreRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customer-profile", customerProfileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/hold-bills", holdBillRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/statements", statementRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", activityRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/adjustments", adjustmentRoutes);
app.use("/api/cancel-bills", cancelBillRoutes);

// Error Middlewares (Always Last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
