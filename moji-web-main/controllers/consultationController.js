const Consultation = require("../models/Consultation");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.createConsultation = catchAsyncErrors(async (req, res, next) => {
  const { name, phone, note, courseTitle } = req.body;

  if (!name || !phone || !courseTitle) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  const consultation = await Consultation.create({
    name,
    phone,
    note,
    courseTitle,
  });

  res.status(201).json({
    success: true,
    message: "Consultation request sent successfully",
    consultation,
  });
});
