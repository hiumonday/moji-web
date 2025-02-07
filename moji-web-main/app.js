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

const errorMiddleware = require("./middlewares/errorMiddleware");

app.use(
  session({
    secret: process.env.SESSION_KEY || 'your-fallback-secret-key',
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
//     origin: FRONTEND_URL ? FRONTEND_URL : "/",
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );
// app.use(cors());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://moji.education"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// passport config
passportConnect();

// Routing
const route = require("./routes/siteRoute");
route(app);

// Add this with your other route imports
const classRoute = require("./routes/admin/classRoute");
const userRoute = require("./routes/admin/userRoute");

// API routes
app.use("/api/v1/admin", classRoute);
app.use("/api/v1/admin", userRoute);

// Error handling middleware
app.use(errorMiddleware);

// Serve static files from the React frontend build folder
app.use(express.static(path.join(__dirname, "../moji-web-frontend-main/build")));

// Catch-all route to serve the React app for any non-API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../moji-web-frontend-main/build", "index.html"));
});

module.exports = app;
