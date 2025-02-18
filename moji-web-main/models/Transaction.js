const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  course_title: { type: String, required: true },
  class_title: { type: String, required: true },
  name: { type: String, required: true },
  tution_fee: { type: Number, required: true },
  discount_type: { type: String },
});

const ClassSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  ebHold: { type: Number, required: true },
});

const TransactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderCode: { type: String, required: true },
    status: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    checkoutUrl: { type: String },
    description: { type: String, required: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    participants: { type: [ParticipantSchema], required: true },
    classes: { type: [ClassSchema], required: true },
    expiryAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      currentTime: () => new Date(new Date().getTime()),
    },
  }
);

// TTL index cho PENDING transactions (1 giờ)
TransactionSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });

// Middleware để tự động set expiryAt dựa trên status
TransactionSchema.pre("save", function (next) {
  if (this.status === "PENDING") {
    // Set expiryAt là 1 giờ từ thời điểm hiện tại
    this.expiryAt = new Date(Date.now() + 60 * 60 * 1000);
  } else if (this.status === "CANCELLED") {
    // Set expiryAt là 1 tuần từ thời điểm hiện tại
    this.expiryAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  } else {
    // Các status khác không set expiryAt
    this.expiryAt = null;
  }
  next();
});

// Middleware để cập nhật expiryAt khi status thay đổi
TransactionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update && update.status) {
    if (update.status === "PENDING") {
      this.set({ expiryAt: new Date(Date.now() + 60 * 60 * 1000) });
    } else if (update.status === "CANCELLED") {
      this.set({ expiryAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    } else {
      this.set({ expiryAt: null });
    }
  }
  next();
});

module.exports = mongoose.model("Transaction", TransactionSchema);
