const PayOS = require("@payos/node");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

module.exports.generateQR = async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3000`;

  const { amount, description } = req.body;
  const orderCode = Number(String(Date.now()).slice(-8));
  const body = {
    orderCode,
    amount,
    description,
    returnUrl: `http://localhost:3001/api/v1/success-transaction`,
    cancelUrl: `http://localhost:3001/api/v1/fail-transaction`,
  };

  console.log(body);
  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    console.log(paymentLinkResponse);

    // Assign orderCode to all products in the user's cart
    await User.updateOne(
      { _id: req.user._id },
      { $set: { "cart.$[].orderCode": orderCode } }
    );

    res.send(paymentLinkResponse);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
};

module.exports.successfulTransaction = async (req, res) => {};
