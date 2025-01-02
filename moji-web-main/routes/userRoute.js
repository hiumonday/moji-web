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

module.exports = router;
