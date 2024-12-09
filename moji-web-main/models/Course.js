const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    title: { type: String },
    img: { type: String },
    description: { type: String },
    price: { type: Number },
    number_of_lessons: { type: Number },
    duration: { type: Date },
    discount_code: [{ type: String }],
    mentor: [{ type: String }]
},{
    timestamps: true
})

module.exports = mongoose.model("Course", courseSchema);