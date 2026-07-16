const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "SALE",
        "PAYMENT",

        "SALE_RETURN",
        "ADJUSTMENT",

        "CREDIT_NOTE",
        "DEBIT_NOTE",

        "CANCELLED_BILL",

        "OPENING_BALANCE",

        "WRITE_OFF",

        "REFUND",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },

    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "BANK"],
      default: "CASH",
    },

    transactionReason: {
      type: String,
      default: "",
    },

    referenceType: {
      type: String,
      enum: ["BILL", "PAYMENT", "RETURN", "ADJUSTMENT", "MANUAL"],
      default: "MANUAL",
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    balanceAfter: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

ledgerSchema.index({
  customerId: 1,
  createdAt: -1,
});

ledgerSchema.index({
  billId: 1,
});

ledgerSchema.index({
  type: 1,
});

module.exports = mongoose.model("Ledger", ledgerSchema);
