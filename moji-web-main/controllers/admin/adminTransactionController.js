const Transaction = require("../../models/Transaction");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

exports.getAllTransactions = catchAsyncErrors(async (req, res, next) => {
  // Get all transactions and sort by newest first, just like user controller
  const transactions = await Transaction.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    transactions,
  });
});
