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

// router.get("/login/fake", fakeLogin);
// router.get("/login/success", isAuthenticatedUser, loginSuccess);
// router.get("/logout", logout);
// router
//   .route("/admin/user/:id")
//   .get(isAuthenticatedUser, authorizedRole("admin"), getUserDetails)
//   .put(isAuthenticatedUser, authorizedRole("admin"), chageUserRole);
// router
//   .route("/admin/users")
//   .get(isAuthenticatedUser, authorizedRole("admin"), getAllUsers);

// router.route("/update/:id").put(isAuthenticatedUser, updateUser1);

// router.put(
//   "/referral/:referrerId/:referredId",
//   isAuthenticatedUser,
//   updateReferralStatus
// );

module.exports = router;
