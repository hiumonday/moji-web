const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    cart: [
      {
        _id: false,
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
        participants: [
          {
            name: { type: String, required: true },
            dateOfBirth: { type: String, required: true },
            isAlumni: { type: Boolean, default: false },
          },
        ],
        addedAt: { type: Date, default: Date.now },
        orderCode: { type: Number },
      },
    ],
    purchasedCourses: [
      {
        _id: false,
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
        participants: [
          {
            name: { type: String, required: true },
            dateOfBirth: { type: String, required: true },
            isAlumni: { type: Boolean, default: false },
          },
        ],
        addedAt: { type: Date, default: Date.now },
      },
    ],
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    appliedDiscount: {
      type: String, // Just store the coupon code
    },
  },
  {
    timestamps: {
      currentTime: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000), // GMT+7
    },
  }
);

// Generate Authentication Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
