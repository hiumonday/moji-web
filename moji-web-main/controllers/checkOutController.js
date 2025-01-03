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
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount,
    description,
    returnUrl: `http://localhost:3001/api/v1/success-transaction`,
    cancelUrl: `http://localhost:3001/api/v1/fail-transaction`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);

    res.send(paymentLinkResponse);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
};

module.exports.successfulTransaction = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Xóa tất cả các sản phẩm trong giỏ hàng của người dùng
    await User.updateOne(
      { _id: userId },
      {
        $push: { purchasedCourses: user.cart }, //chuyển sang cho purchased
        $set: { cart: [] }, // Đặt mảng cart thành rỗng
      }
    );

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching or clearing cart", error });
  }
};
