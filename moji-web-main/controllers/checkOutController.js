const PayOS = require("@payos/node");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const YOUR_DOMAIN = process.env.YOUR_DOMAIN;
const CANCEL_URL = process.env.CANCEL_URL;

module.exports.generateQR = async (req, res) => {
  const { amount, description, transactionData } = req.body;
  const orderCode = Number(String(Date.now()).slice(-8));

  try {
    // Tạo payment link
    const body = {
      orderCode,
      amount,
      description,
      returnUrl: YOUR_DOMAIN,
      cancelUrl: CANCEL_URL,
    };

    const paymentLinkResponse = await payOS.createPaymentLink(body);
    const checkoutUrl = paymentLinkResponse.checkoutUrl;

    // Tạo transaction mới
    const newTransaction = new Transaction({
      ...transactionData,
      orderCode,
      checkoutUrl,
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

    // Find and update the transaction status
    const transaction = await Transaction.findOneAndUpdate(
      { orderCode },
      { status: "CANCELLED" },
      { new: true }
    );

    if (!transaction) {
      throw new Error("Transaction not found");
    }
    console.log("After cancellation: ", process.env.FRONTEND_URL);
    // Redirect back to frontend with status
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}`);

    // res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  } catch (error) {
    console.error("Failed transaction error:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  }
};
