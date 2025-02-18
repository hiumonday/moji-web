const express = require("express");
const {
  createEventDiscount,
  getAllDiscounts,
  createAlumniDiscount,
} = require("../../controllers/admin/discountController");
const {
  isAuthenticatedUser,
  authorizedRole,
} = require("../../middlewares/auth");

const router = express.Router();

// Get all discounts
router.get("/", isAuthenticatedUser, authorizedRole("admin"), getAllDiscounts);

// Create event discount
router.post(
  "/event",
  isAuthenticatedUser,
  authorizedRole("admin"),
  createEventDiscount
);

// Create alumni discount
router.post(
  "/alumni",
  isAuthenticatedUser,
  authorizedRole("admin"),
  createAlumniDiscount
);

module.exports = router;
