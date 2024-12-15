const cartRoute = require("./cartRoute");
const courseRoute = require("./courseRoute");
const userRoute = require("./userRoute");
const checkOutRoute = require("./checkOutRoute");
const transactionRoute = require("./transactionRoute");
const express = require("express");
const app = express();

function route(app) {
  app.use("/api/v1", userRoute);
  app.use("/api/v1", courseRoute);
  app.use("/api/v1", cartRoute);
  app.use("/api/v1", checkOutRoute);
}
// app.use("/api/v1", transactionRoute);

module.exports = route;
