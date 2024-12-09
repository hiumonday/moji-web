const userRoute = require("./userRoute");
const questionRoute = require("./questionRoute");
const examRoute = require("./examRoute");
const passageRoute = require("./summaryRoute");
const dailyRoute = require("./dailyRoute");
const notesRoute = require("./notesRoute");
const ghostRoute = require("./ghostRoute");
const cartRoute = require("./cartRoute");
const transactionRoute = require("./transactionRoute");
const express = require('express');
const app = express();

function route(app) {    
    app.use("/api/v1", userRoute);
    app.use("/api/v1", questionRoute);
    app.use("/api/v1", examRoute);
    app.use("/api/v1", passageRoute);
    app.use("/api/v1", dailyRoute);
    app.use("/api/v1", notesRoute);
    app.use("/api/v1", ghostRoute);
    app.use("/api/v1", cartRoute);
}
// app.use("/api/v1", transactionRoute);

module.exports = route;