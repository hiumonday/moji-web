const express = require("express");
const cartController = require("../controllers/cartController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

// View cart
router.get("/view-cart", isAuthenticatedUser, cartController.viewCart);
// Add course to cart
router.post("/add", isAuthenticatedUser, cartController.addCourseToCart);

// Remove course from cart
router.post(
  "/remove",
  isAuthenticatedUser,
  cartController.removeCourseFromCart
);
router.get("/demo", isAuthenticatedUser, cartController.demoApiForwarding);

module.exports = router;
