const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");
const { isAuthenticatedUser } = require("../middlewares/auth");

// Add logging middleware
router.use("/check-alumni", (req, res, next) => {
  console.log("Alumni route accessed:", {
    method: req.method,
    path: req.path,
    body: req.body,
    isAuthenticated: !!req.user,
  });
  next();
});

router.post(
  "/check-alumni",
  isAuthenticatedUser,
  discountController.checkAlumniCode
);

module.exports = router;
