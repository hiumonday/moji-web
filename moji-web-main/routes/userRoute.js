const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

// Auto-login route using cookie
router.get("/login-success", isAuthenticatedUser, userController.loginSuccess);

// Logout route
router.post("/logout", isAuthenticatedUser, userController.logout);

// Fake login for testing (optional)
router.post("/fake-login", userController.fakeLogin);

// router.get("/auth/google", passport.authenticate("google"));
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "/",
//   }),
//   (req, res) => {
//     const options = {
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
//       httpOnly: true,
//     };
//     res.cookie("token", req.user, options);
//     res.redirect(process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "/");
//   }
// );

// router.get(
//   "/auth/facebook",
//   passport.authenticate("facebook", {
//     scope: ["email"],
//   })
// );
// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     failureRedirect: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "/",
//   }),
//   (req, res) => {
//     const options = {
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
//       httpOnly: true,
//     };
//     res.cookie("token", req.user, options);
//     res.redirect(process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "/");
//   }
// );

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
