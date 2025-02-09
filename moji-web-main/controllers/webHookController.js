const PayOS = require("@payos/node");
const User = require("../models/User");
const { createHmac } = require("crypto");
const dotenv = require("dotenv");
const Transaction = require("../models/Transaction");

const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

module.exports.webhook = async (req, res) => {
  console.log("transaction:");
  let transaction = req.body;

  if (isValidData(transaction.data, transaction.signature, checksumKey)) {
    console.log(transaction);

    if (transaction.success && transaction.code === "00") {
      const { orderCode, transactionDateTime, amount, desc, accountNumber } =
        transaction.data;

      try {
        // Find user by checking if any item in the cart has a matching orderCode
        const user = await User.findOne({ "cart.orderCode": orderCode });

        if (!user) {
          console.error(`User with order code ${orderCode} not found`);
          return res.status(404).end("User not found");
        }

        // Filter cart items with matching orderCode
        const purchasedItems = user.cart.filter(
          (item) => item.orderCode === orderCode
        );

        // Move items from cart to purchasedCourses
        await User.updateOne(
          { _id: user._id },
          {
            $push: { purchasedCourses: { $each: purchasedItems } },
            $pull: { cart: { orderCode: orderCode } },
          }
        );

        // Add transaction to Transaction schema
        const newTransaction = new Transaction({
          _id: orderCode,
          userId: user._id,
          courses: purchasedItems.map((item) => ({
            courseId: item.courseId,
            classId: item.classId,
            price: amount,
            participants: item.participants,
            purchasedAt: transactionDateTime,
          })),
          totalAmount: amount,
          status: transaction.success,
        });

        await newTransaction.save();

        console.log(`Transaction for user ${user._id} processed successfully`);
      } catch (error) {
        console.error("Error processing transaction:", error);
        return res.status(500).end("Error processing transaction");
      }
    } else {
      console.error("Transaction failed or invalid code");
      return res.status(400).end("Transaction failed or invalid code");
    }

    res.end("OK");
  } else {
    console.error("Invalid data signature");
    return res.status(400).end("Invalid data signature");
  }
};

function sortObjDataByKey(object) {
  const orderedObject = Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  return orderedObject;
}

function convertObjToQueryStr(object) {
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];
      // Sort nested object
      if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
      }
      // Set empty string if null
      if ([null, undefined, "undefined", "null"].includes(value)) {
        value = "";
      }

      return `${key}=${value}`;
    })
    .join("&");
}

function isValidData(data, currentSignature, checksumKey) {
  const sortedDataByKey = sortObjDataByKey(data);
  const dataQueryStr = convertObjToQueryStr(sortedDataByKey);
  const dataToSignature = createHmac("sha256", checksumKey)
    .update(dataQueryStr)
    .digest("hex");
  return dataToSignature == currentSignature;
}
