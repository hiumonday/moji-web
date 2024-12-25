const cartRoute = require("./cartRoute");
const courseRoute = require("./courseRoute");
const userRoute = require("./userRoute");
const checkOutRoute = require("./checkOutRoute");
const transactionRoute = require("./transactionRoute");
const express = require("express");
const passport = require("passport");
const app = express();

function route(app) {
  // API routes
  app.use("/api/v1", userRoute);
  app.use("/api/v1", courseRoute);
  app.use("/api/v1", cartRoute);
  app.use("/api/v1", checkOutRoute);
  app.use("/api/v1/", transactionRoute);

  // Google OAuth routes - these should be at the root level, not under /api/v1
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: `${process.env.FRONTEND_URL}/login`,
      session: false,
    }),
    (req, res) => {
      const token = req.user.generateAuthToken();

      const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      };

      res.cookie("token", token, options);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  );
}

module.exports = route;
