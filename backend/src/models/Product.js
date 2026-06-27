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

          enum: ["PIECE", "PACKET", "OUTER", "BOX", "BAG"],

          required: true,
        },

        price: {
          type: Number,

          required: true,

          min: 1,
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
