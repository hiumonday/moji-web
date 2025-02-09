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

// Apply coupon
router.get("/apply-coupon", isAuthenticatedUser, cartController.applyCoupon);
// Remove coupon
router.delete(
  "/remove-coupon",
  isAuthenticatedUser,
  cartController.removeCoupon
);

router.get("/demo", isAuthenticatedUser, cartController.demoApiForwarding);

module.exports = router;
