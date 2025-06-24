const express = require("express");
const cartController = require("../controllers/cartController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

// View cart
router.get("/view-cart", isAuthenticatedUser, cartController.viewCart);
// Add course to cart
router.post(
  "/add-to-cart",
  isAuthenticatedUser,
  cartController.addCourseToCart
);

// Remove course from cart
router.delete(
  "/view-cart/remove/:courseId/:classId",
  isAuthenticatedUser,
  cartController.removeCourseFromCart
);

// Remove coupon
router.delete(
  "/remove-coupon",
  isAuthenticatedUser,
  cartController.removeCoupon
);

// Verify coupon
router.post("/verify-coupon", isAuthenticatedUser, cartController.verifyCoupon);

module.exports = router;
