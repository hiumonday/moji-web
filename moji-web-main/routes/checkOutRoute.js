const express = require("express");
const checkOutController = require("../controllers/checkOutController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

// Route để xử lý yêu cầu tạo liên kết thanh toán
router.post(
  "/create-embedded-payment-link",
  isAuthenticatedUser,
  checkOutController.generateQR
);

router.get(
  "/fail-transaction",
  isAuthenticatedUser,
  checkOutController.failTransaction
);

module.exports = router;
