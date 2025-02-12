const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  course_title: { type: String, required: true },
  class_title: { type: String, required: true },
  name: { type: String, required: true },
  tution_fee: { type: Number, required: true }, // Changed to Number for consistency
  discount_type: { type: String, required: true },
});

const TransactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderCode: { type: String, required: true }, // Thêm orderCode
    status: { type: String, required: true },
    totalAmount: { type: Number, required: true }, // Changed to Number for better calculations
    checkoutUrl: { type: String },
    description: { type: String, required: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }, // Email validation
    phone: { type: String, required: true }, // Phone number validation
    participants: { type: [ParticipantSchema], required: true },
  },
  {
    timestamps: {
      currentTime: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000), // GMT+7
    },
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
