const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    measurementType: {
      type: String,
      enum: ["COUNT", "WEIGHT", "VOLUME", "PACKED"],
      required: false,
      default: null,
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

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
          enum: [
            "PIECE",
            "Ladi",
            "PACKET",
            "GRAM",
            "KG",
            "SET",
            "Jar",
            "OUTER",
            "BOX",
            "BAG",
          ],
          required: true,
        },

        parentUnit: {
          type: String,
          enum: [
            "PIECE",
            "Ladi",
            "PACKET",
            "GRAM",
            "KG",
            "SET",
            "Jar",
            "OUTER",
            "BOX",
            "BAG",
          ],
          default: null,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
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

productSchema.index({
  measurementType: 1,
  category: 1,
  brand: 1,
});

productSchema.index({
  category: 1,
  name: 1,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
