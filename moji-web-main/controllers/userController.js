const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler.js");
const User = require("../models/User");
const Course = require("../models/Course");

module.exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  // Generate JWT token
  const token = newUser.generateAuthToken();
  console.log(token);

  // Set token as a cookie in the response
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Ensures the cookie is accessible only by the server
  };

  res.status(201).cookie("token", token, options).json({
    success: true,
    message: "User registered successfully",
    user: newUser,
  });
});

module.exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  // Compare the passwords
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  // Generate JWT token
  const token = user.generateAuthToken();
  console.log(token);

  // Set token as a cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  };

  console.log(options);

  res.status(200).cookie("token", token, options).json({
    success: true,
    message: "Login successful",
    user,
  });
});

// auto login using cookie
module.exports.loginSuccess = catchAsyncErrors((req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// logout user
exports.logout = catchAsyncErrors((req, res, next) => {
  req.logout((err) => {
    if (err) return next(new ErrorHandler("Logout failed", 400));

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "Lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
      tokenCleared: true,
    });
  });
});

// fake login to test on postman
exports.fakeLogin = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  const token = users[0].generateAuthToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    user: users[0],
  });
});

// get user details -- admin
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// get all users --admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// change user role -- admin
exports.chageUserRole = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const role = req.body.role;

  if (id === req.user.id) {
    return next(new ErrorHandler("You can't change change your own role", 400));
  }

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (role !== "user" && role !== "admin" && role !== "premium") {
    return next(new ErrorHandler("Only user and admin role available", 400));
  }

  user.role = role;

  await user.save();
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.viewCourse = catchAsyncErrors(async (req, res, next) => {
  try {
    courses = await Course.find(); // Fetch all courses
    console.log(courses);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});
