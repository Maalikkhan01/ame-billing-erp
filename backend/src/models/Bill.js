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
      enum: ["PIECE", "PACKET", "GRAM", "KG", "SET", "OUTER", "BOX", "BAG"],
      required: true,
    },

    rate: {
      type: Number,
      required: true,
    },

    mrp: {
      type: Number,
      default: 0,
    },

    amount: {
      type: Number,
      required: true,
    },

    costPrice: {
      type: Number,
      default: 0,
    },

    profitPerUnit: {
      type: Number,
      default: 0,
    },

    totalProfit: {
      type: Number,
      default: 0,
    },

    returnedQty: {
      type: Number,
      default: 0,
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

    totalProfit: {
      type: Number,
      default: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
    },

    previousDue: {
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

    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "PARTIAL_RETURN", "FULL_RETURN"],
      default: "ACTIVE",
    },

    returnedAmount: {
      type: Number,
      default: 0,
    },

    cancelReason: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  },
);

billSchema.index({
  createdAt: -1,
});

billSchema.index({
  customerId: 1,
});

module.exports = mongoose.model("Bill", billSchema);
