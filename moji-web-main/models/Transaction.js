const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courses: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
            price: { type: Number },
            discountCode: { type: String },
            purchasedAt: { type: Date, default: Date.now }
        }
    ],
    content: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["PayOS", "VNPAY"], required: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Completed" }
}, {
    timestamps: true
});

module.exports = mongoose.model("Transaction", transactionSchema);
