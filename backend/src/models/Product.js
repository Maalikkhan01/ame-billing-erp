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

    piecePrice: {
      type: Number,
      required: true,
      min: 1,
    },

    hasPacking: {
      type: Boolean,
      default: false,
    },

    packingType: {
      type: String,
      enum: ["BOX", "BAG", ""],
      default: "",
    },

    packingQty: {
      type: Number,
      default: 0,
    },

    packingPrice: {
      type: Number,
      default: 0,
    },

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
  }
);

productSchema.index({
  name: 1,
});

productSchema.index({
  name: "text",
});

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

module.exports = Product;