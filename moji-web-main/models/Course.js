const mongoose = require("mongoose");

const learningPlatformSchema = mongoose.Schema({
  platform: { type: String },
  access_code: { type: String },
  access_link: { type: String },
  _id: false,
});

const syllabusSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  duration: { type: String },
  _id: false,
});

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["contact_based", "non_contact_based"],
      required: true,
    },
    description: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    price: {
      type: Number,
      required: function () {
        return this.type === "non_contact_based";
      },
    },
    earlyBirdPrice: {
      type: Number,
      required: function () {
        return this.type === "non_contact_based";
      },
    },
    bundlePrice: { type: Number },
    alumniPrice: { type: Number },
    is_active: { type: Boolean, default: false },
    classes: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
          required: true,
        },
        level: { type: String, required: true },
        language: { type: String, required: true },
        class_session: { type: Number, required: true },
        target_audience: { type: String, required: true },
        goals: { type: String, required: true },
        syllabus: [syllabusSchema],
        location: { type: String },
        teacherName: { type: String, required: true },
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        learning_platform: { type: learningPlatformSchema },
        earlyBirdSlot: {
          type: Number,
          default: 0,
          required: true,
        },
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
    timestamps: {
      currentTime: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000), // GMT+7
    },
  }
);

module.exports = mongoose.model("Course", courseSchema);
