const PayOS = require("@payos/node");
const User = require("../models/User");
const Course = require("../models/Course");
const Transaction = require("../models/Transaction");
const dotenv = require("dotenv");

dotenv.config();
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

module.exports.generateQR = async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3000`;
  const { amount, description, transactionData } = req.body;
  const orderCode = Number(String(Date.now()).slice(-8));

  try {
    // Giảm số lượng early bird slot cho mỗi lớp
    for (const classData of transactionData.classes) {
      if (classData.ebHold > 0) {
        await Course.updateOne(
          { "classes._id": classData.class_id },
          { $inc: { "classes.$.earlyBirdSlot": -classData.ebHold } }
        );
      }
    }

    // Tạo payment link
    const body = {
      orderCode,
      amount,
      description,
      returnUrl: YOUR_DOMAIN,
      cancelUrl: `http://localhost:3001/api/v1/fail-transaction`,
    };

    const paymentLinkResponse = await payOS.createPaymentLink(body);
    const checkoutUrl = paymentLinkResponse.checkoutUrl;

    // Tạo transaction mới
    const newTransaction = new Transaction({
      ...transactionData,
      orderCode,
      checkoutUrl,
      status: "PENDING",
    });
    await newTransaction.save();

    // Cập nhật orderCode cho cart
    await User.updateOne(
      { _id: req.user._id },
      { $set: { "cart.$[].orderCode": orderCode } }
    );

    res.send(paymentLinkResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

module.exports.failTransaction = async (req, res) => {
  try {
    const { orderCode } = req.query;

    if (!orderCode) {
      throw new Error("OrderCode is required");
    }

    // Find the transaction
    const transaction = await Transaction.findOne({ orderCode });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Hoàn trả early bird slots cho mỗi lớp
    for (const classData of transaction.classes) {
      if (classData.ebHold > 0) {
        await Course.updateOne(
          { "classes._id": classData.class_id },
          { $inc: { "classes.$.earlyBirdSlot": classData.ebHold } }
        );
      }
    }

    // Update transaction status
    await Transaction.findOneAndUpdate(
      { orderCode },
      { status: "CANCELLED" },
      { new: true }
    );

    // Redirect back to frontend with status
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  } catch (error) {
    console.error("Failed transaction error:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  }
};
