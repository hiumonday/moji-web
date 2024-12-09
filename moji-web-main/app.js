const express = require("express");
const passport = require("passport");
const passportConnect = require("./config/passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const app = express();

// config
// if (process.env.NODE_ENV !== "PRODUCTION") {
require("dotenv").config({ path: "./.env" });
// }

// Routes import
const userRoute = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const examRoute = require("./routes/examRoute");
const passageRoute = require("./routes/summaryRoute");
const dailyRoute = require("./routes/dailyRoute");
const notesRoute = require("./routes/notesRoute");
const ghostRoute = require("./routes/ghostRoute");
const demoRoute = require("./routes/demoRoute");

const errorMiddleware = require("./middlewares/errorMiddleware");
const scheduler = require("./utils/moduleScheduler");

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json({ limit: "4.5mb" }));
app.use(express.urlencoded({ extended: true, limit: "4.5mb" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// cors cofiguration
// app.use(
//   require("cors")({
//     origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "/",
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );
// app.use(cors());

// passport config
passportConnect();

// test module schedule
// scheduler();

app.use("/api/v1", userRoute);
app.use("/api/v1", questionRoute);
app.use("/api/v1", examRoute);
app.use("/api/v1", passageRoute);
app.use("/api/v1", dailyRoute);
app.use("/api/v1", notesRoute);
app.use("/api/v1", ghostRoute);
app.use("/api/v1", demoRoute);

// app.use(express.static(path.join(__dirname + "../moji-web-frontend-main/build")));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, "../moji-web-frontend-main/build/index.html"));
// });

// error middileware
app.use(errorMiddleware);

module.exports = app;
