const express = require("express");
const {
  addDiscountCode,
} = require("../../controllers/admin/discountController");

const router = express.Router();

router.route("/").post(addDiscountCode);

module.exports = router;
