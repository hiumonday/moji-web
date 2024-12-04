const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler.js");
const User = require("../models/User");

// auto login using cookie
exports.loginSuccess = catchAsyncErrors((req, res, next) => {
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
		});

		res.status(200).json({
			success: true,
			message: "Logged Out",
		});
	});
});

// fake login to test on postman
exports.fakeLogin = catchAsyncErrors(async (req, res, next) => {
	const users = await User.find();

	const token = users[0].generateAuthToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
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
		return next(
			new ErrorHandler("You can't change change your own role", 400),
		);
	}

	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}

	if (role !== "user" && role !== "admin" && role !== "premium") {
		return next(
			new ErrorHandler("Only user and admin role available", 400),
		);
	}

	user.role = role;

	await user.save();
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});

exports.updateUser1 = catchAsyncErrors(async (req, res, next) => {
	const id = req.params.id;
	const { desiredScore, satPurpose } = req.body;
	// console.log(req.body);
	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}

	user.aim = desiredScore;
	user.goal = satPurpose;

	await user.save();

	res.status(200).json({
		success: true,
		user,
	});
});


exports.updateReferralStatus = catchAsyncErrors(async (req, res, next) => {
	try {
		const { referrerId, referredId } = req.params;

		if (referrerId === referredId) {
			console.log('stupid')
			return res.status(400).json({
				success: false,
				message: "Không hơp lệ"
			});
		}

		const referrer = await User.findById(referrerId);
		const referred = await User.findById(referredId);

		console.log(referred);
		console.log(referrer);

		if (!referrer || !referred || Object.keys(referrer).length === 0 || Object.keys(referred).length === 0) {
			return res.status(404).json({
				success: false,
				message: "Mã giới thiệu không hợp lệ"
			});
		}

		referrer.referralUsageCount += 1;
		referrer.set({ isReferred: true });

		if (referred.referralUsageCount === 0) {
			referred.referralUsageCount += 1;
		}
		referred.set({ isReferred: true });

		// Update role if they are not admin or already premium
		if (referrer.role !== 'admin' && referrer.role !== 'premium') {
			referrer.set({ role: "premium" });
		}

		if (referred.role !== 'admin' && referred.role !== 'premium') {
			referred.set({ role: "premium" });
		}

		// Save the changes
		await referrer.save();
		await referred.save();
		return res.status(200).json({
			success: true,
			message: "Nhập mã thành công, chúc mừng bạn đã trở thành thành viên Premium!",
			referrer,
			referred
		});
	} catch (error) {
		// Handle errors
		return res.status(500).json({
			success: false,
			message: "Mã giới thiệu không hợp lệ hoặc đã bị sử dụng"
		});
	}
});
