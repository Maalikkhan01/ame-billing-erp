const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    unitType: {
      type: String,
      enum: ["PIECE", "BOX", "BAG"],
      required: true,
    },

    rate: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    items: [billItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
    },

    paymentType: {
      type: String,
      enum: ["FULL", "PARTIAL", "DUE"],
      required: true,
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

module.exports = mongoose.model("Bill", billSchema);
