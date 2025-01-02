const PayOS = require("@payos/node");
const User = require("../models/User");
const dotenv = require("dotenv");

module.exports.webhook = async (req, res) => {
  let error = req.body.error;
  if (error != 0) {
    //Không làm gì cả.
    return;
  }

  //mảng chứa danh sách các giao dịch
  let transactions = req.body.data;

  console.log(
    `Received ${
      Object.keys(transactions).length
    } transactions: ${JSON.stringify(transactions)}`
  );

  //thêm code xử lý giao dịch ở đây.

  res.end("OK");
};
