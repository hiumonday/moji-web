const Consultation = require("../../models/Consultation");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

// Get all consultations
exports.getAllConsultations = catchAsyncErrors(async (req, res, next) => {
  const consultations = await Consultation.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    consultations,
  });
});

// Update consultation status
exports.updateConsultationStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !["pending", "contacted"].includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  const consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!consultation) {
    return next(new ErrorHandler("Consultation not found", 404));
  }

  res.status(200).json({
    success: true,
    consultation,
  });
});
