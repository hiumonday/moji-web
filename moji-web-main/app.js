const express = require("express");
const passport = require("passport");
const passportConnect = require("./config/passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const app = express();

require("dotenv").config({ path: "./.env" });

const allowedOrigins = ["http://localhost:3000", "https://moji.education/"];

const errorMiddleware = require("./middlewares/errorMiddleware");

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
app.use(
  cors({
    origin: [
      "https://vdrlh08h-3000.asse.devtunnels.ms", // Remote frontend URL
      "http://localhost:3000", // Local frontend URL
    ], // Allow frontend access
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin:
//       process.env.FRONTEND_URL ||
//       "http://localhost:3000" ||
//       "http://localhost:3001",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// passport config
passportConnect();

// test module schedule
// scheduler();

// Routing
const route = require("./routes/siteRoute");
route(app);

// Add this with your other route imports
const classRoute = require("./routes/admin/classRoute");
const userRoute = require("./routes/admin/userRoute");

// Add this with your other app.use statements
app.use("/api/v1/admin", classRoute);
app.use("/api/v1/admin", userRoute);

// Add this with your other app.use statements
app.use(errorMiddleware);

module.exports = app;
