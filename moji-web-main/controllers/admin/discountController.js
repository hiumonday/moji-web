const DiscountCode = require("../../models/DiscountCode");

// @desc    Add new discount code
// @route   POST /api/v1/admin/discount
// @access  Private/Admin
exports.addDiscountCode = async (req, res) => {
  const { discount_type, discount_code, percentage, expiresAt, usage_count } =
    req.body;

  const discountCode = await DiscountCode.create({
    discount_type,
    discount_code,
    percentage,
    expiresAt,
    usage_count: usage_count || 1,
  });

  res.status(201).json({
    success: true,
    data: discountCode,
  });
};
