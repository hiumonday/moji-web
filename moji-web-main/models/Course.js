const mongoose = require("mongoose");

const learningPlatformSchema = mongoose.Schema({
  platform: { type: String },
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
    earlyBirdPrice: { type: Number },
    bundlePrice: { type: Number },
    alumniPrice: { type: Number },
    is_active: { type: Boolean, default: false },
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
        learning_platform: { type: learningPlatformSchema },
        earlyBirdSlot: { type: Number, default: 0 },
        participants: [
          {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            participantId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User.purchasedCourses.participants",
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
