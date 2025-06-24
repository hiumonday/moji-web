const express = require("express");
const {
  isAuthenticatedUser,
  authorizedRole,
} = require("../../middlewares/auth");
const adminController = require("../../controllers/admin/adminController");

const router = express.Router();

// router.post(
//   "/create",
//   isAuthenticatedUser,
//   authorizedRole("admin"),
//   adminController.createAdminUser
// );
router.post("/create", adminController.createAdminUser);
router.post("/login", adminController.adminLogin);

module.exports = router;
