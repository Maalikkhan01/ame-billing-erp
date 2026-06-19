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
      enum: ["SALE", "PAYMENT"],
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

module.exports = mongoose.model("Ledger", ledgerSchema);
