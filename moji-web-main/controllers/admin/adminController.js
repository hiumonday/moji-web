const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../../utils/errorHandler.js");
const User = require("../../models/User.js");

// Create Admin Account
module.exports.createAdminUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Check if required fields are provided
  if (!name || !email || !phone || !password) {
    return next(
      new ErrorHandler(
        "All fields are required: name, email, phone, and password.",
        400
      )
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists.", 400));
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new admin user
  const adminUser = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    role: "admin",
  });

  await adminUser.save();

  res.status(201).json({
    success: true,
    message: "Admin user created successfully.",
    admin: {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    },
  });
});

// Admin Login
exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Find admin user with password
  const admin = await User.findOne({ email, role: "admin" }).select(
    "+password"
  );

  if (!admin) {
    return next(new ErrorHandler("Invalid admin credentials", 401));
  }

  // Check password
  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid admin credentials", 401));
  }

  // Generate token
  const token = admin.generateAuthToken();

  // Set cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  };

  // Remove password from admin object
  const adminWithoutPassword = admin.toObject();
  delete adminWithoutPassword.password;

  res.status(200).cookie("token", token, options).json({
    success: true,
    message: "Admin login successful",
    admin: adminWithoutPassword,
  });
});
