const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
    },

    currentDue: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

customerSchema.index({
  isActive: 1,
  createdAt: -1,
});

customerSchema.index({
  currentDue: -1,
});

customerSchema.index({
  name: "text",
});

module.exports = mongoose.model("Customer", customerSchema);
