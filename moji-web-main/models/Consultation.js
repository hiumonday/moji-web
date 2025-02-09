const mongoose = require("mongoose");

const consultationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    note: {
      type: String,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted"],
      default: "pending",
    },
  },
  {
    timestamps: {
      currentTime: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000), // GMT+7
    },
  }
);

module.exports = mongoose.model("Consultation", consultationSchema);
