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
          },
        ],
        addedAt: { type: Date, default: Date.now },
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
  },
  {
    timestamps: true,
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
