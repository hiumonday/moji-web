const mongoose = require("mongoose");

const learningPlatformSchema = mongoose.Schema({
  access_code: { type: String },
  access_link: { type: String },
  _id: false,
});

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { data: Buffer, contentType: String },
    price: { type: Number, required: true },
    earlyBirdPrice: { type: Number, required: true },
    earlyBirdSlot: { type: Number, default: 5 },
    discounts: [
      {
        _id: false,
        code: { type: String, required: true },
        percentage: { type: Number },
        amount: { type: Number },
        expiresAt: { type: Date },
      },
    ],
    classes: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
          require: true,
        },
        level: { type: String, require: true },
        language: { type: String, require: true },
        teacherName: { type: String, require: true },
        day: { type: String, require: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        location: { type: String },
      },
    ],
    learning_platform: { type: learningPlatformSchema },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
