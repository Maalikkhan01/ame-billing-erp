const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    units: [
      {
        type: {
          type: String,
          enum: ["PIECE", "PACKET", "GRAM", "KG", "SET", "OUTER", "BOX", "BAG"],
          required: true,
        },

        price: {
          type: Number,
          required: true,
          min: 1,
        },

        mrp: {
          type: Number,
          default: 0,
          min: 0,
        },

        costPrice: {
          type: Number,
          default: 0,
          min: 0,
        },

        openingStock: {
          type: Number,
          default: 0,
          min: 0,
        },

        currentStock: {
          type: Number,
          default: 0,
          min: 0,
        },

        lowStockAlert: {
          type: Number,
          default: 5,
          min: 0,
        },
      },
    ],

    active: {
      type: Boolean,
      default: true,
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

productSchema.index({
  name: 1,
});

productSchema.index({
  active: 1,
  createdAt: -1,
});

productSchema.index({
  name: "text",
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
