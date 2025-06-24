const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler.js");
const User = require("../models/User");
const Course = require("../models/Course");
const Transaction = require("../models/Transaction.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

module.exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

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
    phone,
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
    return next(new ErrorHandler("Invalid email", 401));
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

  // console.log(options);

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
exports.logout = catchAsyncErrors(async (req, res, next) => {
  // Delete the token cookie by setting an empty value and immediate expiration
  res.cookie("token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: "localhost", // Explicitly set domain in development
  });

  // Clear user from request
  req.user = null;

  // Set no-cache headers
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
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

exports.getTransactionHistory = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user._id);
  const transactions = await Transaction.find({ user_id: req.user._id }).sort({
    createdAt: -1,
  }); // Sắp xếp theo thời gian mới nhất

  res.status(200).json({
    success: true,
    transactions,
  });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate Reset Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and save to database
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset link is:\n\n${resetUrl}\n\nIf you have not requested this, please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash token from URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset token is invalid or has expired", 400));
  }

  // Set new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Log the user in
  const token = user.generateAuthToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    message: "Password reset successful",
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Check old password
  const isPasswordMatch = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Update to new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.newPassword, salt);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
