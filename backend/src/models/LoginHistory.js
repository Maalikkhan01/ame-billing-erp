const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

loginHistorySchema.index({
  createdAt: -1,
});

module.exports = mongoose.model(
  "LoginHistory",
  loginHistorySchema
);