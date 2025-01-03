const PayOS = require("@payos/node");
const User = require("../models/User");
const dotenv = require("dotenv");

module.exports.webhook = async (req, res) => {
  //mảng chứa danh sách các giao dịch
  let transactions = req.body.data;

  console.log(transactions);

  //thêm code xử lý giao dịch ở đây.

  res.end("OK");
};
