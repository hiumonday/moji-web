const mongoose = require("mongoose");

const learningPlatformSchema = mongoose.Schema({
  access_code: { type: String },
  access_link: { type: String },
  _id: false,
});

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    img: { type: String },
    description: { type: String },
    format: { type: String },
    price: { type: Number, required: true },
    original_price: { type: Number, required: true },
    number_of_lessons: { type: Number },
    session_time: { type: String },
    course_duration: { type: Date },
    discount_code: [{ type: String }],
    mentor: [{ type: String }],
    learning_platform: { type: learningPlatformSchema },
    flash_sale: {
      type: {
        is_active: { type: Boolean, default: false },
        discount_amount: { type: Number },
        end_date: { type: Date },
      },
      default: {},
      _id: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema, "Course");
