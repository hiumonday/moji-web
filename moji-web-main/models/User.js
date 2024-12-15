const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    cart: [
      {
        _id: false,
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        level: { type: String },
        language: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    purchasedCourses: [
      {
        _id: false,
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        level: { type: String },
        language: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

//Generate Authentication Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
