const PayOS = require("@payos/node");
const User = require("../models/User");
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
    // Tạo payment link
    const body = {
      orderCode,
      amount,
      description,
      returnUrl: `http://localhost:3001/api/v1/success-transaction`,
      cancelUrl: `http://localhost:3001/api/v1/fail-transaction`,
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

module.exports.successfulTransaction = async (req, res) => {};
