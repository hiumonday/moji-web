const express = require("express");
const {
  getAllTransactions,
} = require("../../controllers/admin/adminTransactionController");
const {
  isAuthenticatedUser,
  authorizedRole,
} = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/transactions")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllTransactions);

module.exports = router;
