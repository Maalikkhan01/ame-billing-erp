const mongoose = require("mongoose");

const holdBillItemSchema = new mongoose.Schema(
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

    unitType: {
      type: String,
      enum: ["PIECE", "PACKET", "OUTER", "BOX", "BAG"],
      required: true,
    },

    qty: {
      type: Number,
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

const holdBillSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    items: [holdBillItemSchema],

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("HoldBill", holdBillSchema);
