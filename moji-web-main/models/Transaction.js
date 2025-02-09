const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // Added classId
        price: { type: Number },
        discountCode: { type: String },
        purchasedAt: { type: Date, default: Date.now },
        participants: [
          {
            name: { type: String, required: true },
            price: { type: Number, required: true },
          },
        ],
      },
    ],

    totalAmount: { type: Number, required: true },

    status: {
      type: Boolean,
    },
  },
  {
    timestamps: {
      currentTime: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000), // GMT+7
    },
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
