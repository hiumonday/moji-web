const DiscountCode = require("../../models/DiscountCode");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

// @desc    Add new discount code
// @route   POST /api/v1/admin/discount
// @access  Private/Admin
exports.addDiscountCode = catchAsyncErrors(async (req, res, next) => {
  const { discount_code, percentage, expiresAt, discount_type } = req.body;

  if (!discount_code || !percentage || !expiresAt || !discount_type) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const discount = await DiscountCode.create({
    discount_code,
    percentage,
    expiresAt,
    discount_type,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    discount,
  });
});

exports.createAlumniDiscount = catchAsyncErrors(async (req, res, next) => {
  const { discount_code, expiresAt } = req.body;

  if (!discount_code || !expiresAt) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Check if discount code already exists
  const existingCode = await DiscountCode.findOne({ discount_code });
  if (existingCode) {
    return next(new ErrorHandler("Discount code already exists", 400));
  }

  const discount = await DiscountCode.create({
    discount_code,
    discount_type: "alumni",
    expiresAt,
    isActive: true,
    percentage: 0, // Alumni discounts don't use percentage
  });

  res.status(201).json({
    success: true,
    discount,
  });
});

// @desc    Add new event discount code
// @route   POST /api/v1/admin/discount/event
// @access  Private/Admin
exports.createEventDiscount = catchAsyncErrors(async (req, res, next) => {
  const { discount_code, percentage, expiresAt } = req.body;

  if (!discount_code || !percentage || !expiresAt) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Validate percentage is between 0 and 100
  if (percentage < 0 || percentage > 100) {
    return next(new ErrorHandler("Percentage must be between 0 and 100", 400));
  }

  // Check if discount code already exists
  const existingCode = await DiscountCode.findOne({ discount_code });
  if (existingCode) {
    return next(new ErrorHandler("Discount code already exists", 400));
  }

  const discount = await DiscountCode.create({
    discount_code,
    percentage,
    expiresAt,
    discount_type: "event",
    isActive: true,
  });

  res.status(201).json({
    success: true,
    discount,
  });
});

// @desc    Get all discounts
// @route   GET /api/v1/admin/discount
// @access  Private/Admin
exports.getAllDiscounts = catchAsyncErrors(async (req, res, next) => {
  const discounts = await DiscountCode.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    discounts,
  });
});
