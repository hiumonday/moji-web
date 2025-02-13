const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

// Auto-login route using cookie
router.get("/login/success", isAuthenticatedUser, userController.loginSuccess);

// Logout route
router.get("/logout", isAuthenticatedUser, userController.logout);

// Fake login for testing (optional)
router.post("/fake-login", userController.fakeLogin);

router.get("/viewCourse", userController.viewCourse);

router.get(
  "/transaction-history",
  isAuthenticatedUser,
  userController.getTransactionHistory
);

// Add these new routes
router.post("/password/forgot", userController.forgotPassword);
router.put("/password/reset/:token", userController.resetPassword);
router.put(
  "/password/update",
  isAuthenticatedUser,
  userController.updatePassword
);

module.exports = router;
