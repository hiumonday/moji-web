const mongoose = require("mongoose");

const discountCodeSchema = mongoose.Schema(
  {
    discount_type: {
      type: String,
      required: true,
      enum: ["event", "alumni"],
    },
    discount_code: {
      type: String,
      required: true,
      unique: true,
    },
    percentage: {
      type: Number,
      required: function () {
        return this.discount_type === "event";
      },
      min: 0,
      max: 100,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usage_count: {
      type: Number,
      default: 1,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: {
      currentTime: () => new Date(new Date().getTime()),
    },
  }
);

const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);

module.exports = DiscountCode;
