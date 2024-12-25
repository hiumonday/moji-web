const express = require("express");
const passport = require("passport");
const passportConnect = require("./config/passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const app = express();

require("dotenv").config({ path: "./.env" });

const allowedOrigins = ["http://localhost:3000", "https://moji.education/"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

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
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:3000" ||
      "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// passport config
passportConnect();

// test module schedule
// scheduler();

// Routing
const route = require("./routes/siteRoute");
route(app);

// Add this with your other route imports

// app.use(express.static(path.join(__dirname + "../moji-web-frontend-main/build")));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, "../moji-web-frontend-main/build/index.html"));
// });

// error middileware
app.use(errorMiddleware);

module.exports = app;
