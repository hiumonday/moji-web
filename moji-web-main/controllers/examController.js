const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Module = require("../models/Module");
const Question = require("../models/Question");
const Test = require("../models/Test");
const Exam = require("../models/Exam");
const mongoose = require("mongoose");

// get all available tests
exports.getTests = catchAsyncErrors(async (req, res, next) => {
	const tests = await Test.aggregate([
		{
			$project: {
				name: 1,
				_id: 1,
				createdAt: 1, // Include the createdAt field if it exists
				premium: 1,
				premiumLevel: 1,
				score: 1,
			},
		},
		{
			$sort: {
				createdAt: 1,
			},
		},
	]);

	res.status(200).json({
		success: true,
		tests,
	});
});

exports.getDailyTests = catchAsyncErrors(async (req, res, next) => {
	// Get the user from the request
	const user = req.user;
	console.log("heheh");

	const tests = await Test.aggregate([
		{
			$match: {
				daily: true, // Only include documents where "daily" is true
				_id: { $nin: user.takenTests }, // Exclude tests that the user has already taken
				isComplete: true, // Only include tests that are complete
			},
		},
		{
			$project: {
				name: 1,
				_id: 1,
				createdAt: 1, // Include the createdAt field if it exists
				premium: 1,
			},
		},
		{
			$sort: {
				createdAt: 1,
			},
		},
	]);

	res.status(200).json({
		success: true,
		tests,
	});
});

// get all available modules of a test
exports.getModules = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);

	if (!test) return next(new ErrorHandler("Test not found", 404));

	const modules = await Module.find({ test: test.id }).sort({ createdAt: 1 });

	const moduleWithQuestionsCount = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				module: module._id,
				test: test._id,
			}).sort({ questionNumber: 1 });


			return {
				...module.toObject(),
				questionsCount: questions.length,
			};
		}),
	);

	res.status(200).json({
		success: true,
		test: {
			...test.toObject(),
			modules: moduleWithQuestionsCount,
		},
	});
});

// starting a exam(will recieve the questions without answer)
exports.startExam = catchAsyncErrors(async (req, res, next) => {
	const test = await Test.findById(req.params.id);
	if (!test) return next(new ErrorHandler("Test not found", 404));

	const modules = await Module.find({ test: test.id }).sort({ createdAt: 1 });

	const modulesQuestions = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				test: test.id,
				module: module.id,
			}).sort({ questionNumber: 1 });

			const moduleObj = module.toObject();

			return { ...moduleObj, questions };
		}),
	);

	const exam = await Exam.create({
		test: test.id,
		user: req.user.id,
		modules: [
			{
				module: modulesQuestions[0]._id,
				lastStartTime: new Date(Date.now()),
				questions: modulesQuestions[0].questions.map((question) => ({
					question: question._id,
				})),
			},
		],
	});

	await exam.populate("test");

	res.status(201).json({
		success: true,
		modulesQuestions,
		exam,
	});
});

// complete module
exports.completeModule = catchAsyncErrors(async (req, res, next) => {
	const { answers, totalTime } = req.body;
	if (!answers) return next(new ErrorHandler("Please provide answers"));
	if (!totalTime) return next(new ErrorHandler("Please provide module time"));

	const exam = await Exam.findOne({
		_id: req.params.id,
		user: req.user.id,
	}).populate("test");
	if (!exam) return next(new ErrorHandler("Exam not found", 404));

	if (exam.isComplete)
		return next(new ErrorHandler("Exam completed before", 400));

	if (exam.breakTime)
		return next(new ErrorHandler("Skip the break time to continue", 400));

	const module = await Module.findById(req.params.module);
	if (!module) return next(new ErrorHandler("Module not found", 404));

	const moduleIndex = exam.modules.findIndex(
		(mod) => mod.module.toString() === module._id.toString(),
	);
	if (moduleIndex === -1)
		return next(new ErrorHandler("Module not found in Exam", 404));

	if (exam.modules[moduleIndex].isComplete)
		return next(new ErrorHandler("Module already complete", 404));

	const questions = await Question.find({
		module: module.id,
	})
		.sort({ questionNumber: 1 })
		.select("+options.answer")
		.select("+options.reason");

	const moduleQuestions = exam.modules.find((testModule) =>
		testModule.module.equals(module._id),
	).questions;

	// Check if answers match module questions
	const isAnswersMatching = answers.every((answer) =>
		moduleQuestions.some(
			(moduleQuestion) =>
				moduleQuestion.question.toString() === answer.question,
		),
	);

	if (!isAnswersMatching) {
		return next(
			new ErrorHandler(
				"Mismatch between answers and exam questions",
				400,
			),
		);
	}

	// Check if answers are correct and update the answers array
	const updatedAnswers = answers.map((answer) => {
		const moduleQuestion = questions.find(
			(question) => question.id === answer.question,
		);

		if (moduleQuestion.optionsType === "type") {
			const selectedOptions = moduleQuestion.options.filter((option) =>
				answer.answer.includes(option.option),
			);

			const isCorrect =
				selectedOptions.length < 1
					? false
					: selectedOptions.some(
							(option) => option.answer === "right",
					  );

			const reason =
				selectedOptions.length < 1
					? ["Conceptual understanding"]
					: selectedOptions.map((option) => option.reason);

			return {
				...answer,
				isCorrect,
				reason,
				hasAnswered: true,
			};
		} else {
			const selectedOptions = moduleQuestion.options.filter((option) =>
				answer.answer.includes(option.id),
			);

			const allCorrect = selectedOptions.every(
				(option) => option.answer === "right",
			);

			const isCorrect =
				allCorrect &&
				selectedOptions.every((selectedOption) =>
					answer.answer.includes(selectedOption.id),
				) &&
				moduleQuestion.options
					.filter((option) => option.answer === "right")
					.every((correctOption) =>
						answer.answer.includes(correctOption.id),
					);

			const reason = selectedOptions.map((option) => option.reason);

			return {
				...answer,
				isCorrect,
				reason,
				hasAnswered: true,
			};
		}
	});

	exam.modules[moduleIndex].questions = updatedAnswers;
	exam.modules[moduleIndex].totalTime = totalTime;

	const modules = await Module.find({
		test: exam.test,
	});

	if (moduleIndex + 1 >= modules.length) {
		exam.breakTime = null;
		exam.modules[moduleIndex].isComplete = true;
		await exam.save();
		const examCopy = await Exam.findById(exam.id);
		await examCopy.populate("test");

		return res.status(200).json({
			success: true,
			message: "All module answered, you can submit the test now",
			exam,
		});
	}

	const currentTimestamp = Date.now();

	const breakDuration = 10 * 60 * 1000;
	const newBreakTime = new Date(currentTimestamp + breakDuration);
	exam.breakTime = newBreakTime;
	exam.modules[moduleIndex].isComplete = true;

	await exam.save();

	return res.status(200).json({
		success: true,
		message: " You have a 10-minute break before starting the next module.",
		breakTime: newBreakTime,
		exam,
	});
});

// skip module break
exports.skipModuleBreak = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findOne({
		_id: req.params.id,
		user: req.user.id,
	}).populate("test");

	if (!exam) return next(new ErrorHandler("Exam not found", 404));
	if (exam.isComplete)
		return next(new ErrorHandler("Exam completed before", 400));

	if (!exam.breakTime) {
		res.status(200).json({
			success: false,
			message: "Module is running",
			exam,
		});
	}

	const modules = await Module.find({
		test: exam.test,
	}).sort({ createdAt: 1 });

	const lastModuleIndex = exam.modules.length - 1;

	if (lastModuleIndex < 0) {
		return next(new ErrorHandler("No modules found in the Exam", 400));
	}

	const nextModuleIndex = lastModuleIndex + 1;

	if (nextModuleIndex < modules.length) {
		const nextModule = modules[nextModuleIndex];
		const questions = await Question.find({ module: nextModule.id }).sort({
			questionNumber: 1,
		});

		if (questions.length > 0) {
			exam.modules.push({
				module: nextModule._id,
				lastStartTime: Date.now(),
				questions: questions.map((question) => ({
					question: question._id,
				})),
			});
		} else {
			return res.status(200).json({
				success: false,
				message:
					"Then next module has no question, Might be in maintainance mode. you can submit the test",
			});
		}
	} else {
		exam.breakTime = null;
		await exam.save();

		return res.status(200).json({
			success: true,
			message: "All module answered, you can submit the test now",
			exam,
		});
	}

	exam.breakTime = null;
	await exam.save();

	return res.status(200).json({
		success: true,
		exam,
	});
});

// module break finish
exports.finishModuleBreak = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findOne({
		_id: req.params.id,
		user: req.user.id,
	}).populate("test");

	if (!exam) return next(new ErrorHandler("Exam not found", 404));

	if (exam.isComplete)
		return next(new ErrorHandler("Exam completed before", 400));

	if (exam.breakTime) {
		return next(new ErrorHandler("Please skip module break or wait", 400));
	}

	const lastModuleIndex = exam.modules.length - 1;

	if (lastModuleIndex < 0) {
		return next(new ErrorHandler("No modules found in the Exam", 400));
	}

	const lastModule = exam.modules[lastModuleIndex - 1];
	const moduleQuestions = lastModule.questions;

	const hasUnansweredQuestions = moduleQuestions.some(
		(question) => !question.hasAnswered,
	);

	if (hasUnansweredQuestions) {
		return next(
			new ErrorHandler("Previous module is still in progress", 400),
		);
	}

	const modules = await Module.find({
		test: exam.test,
	}).sort({ createdAt: 1 });
	const nextModuleIndex = lastModuleIndex + 1;

	if (nextModuleIndex < modules.length) {
		const nextModule = modules[nextModuleIndex];
		const questions = await Question.find({ module: nextModule.id }).sort({
			questionNumber: 1,
		});

		if (questions.length > 0) {
			exam.modules.push({
				module: nextModule._id,
				lastStartTime: Date.now(),
				questions: questions.map((question) => ({
					question: question._id,
				})),
			});
		} else {
			return res.status(200).json({
				success: false,
				message:
					"Then next module has no question, Might be in maintainance mode. you can submit the test",
			});
		}
	} else {
		exam.breakTime = null;
		await exam.save();

		return res.status(200).json({
			success: true,
			message: "All module answered, you can submit the test now",
			exam,
		});
	}

	await exam.save();

	return res.status(200).json({
		success: true,
		exam,
	});
});

exports.getOwnAllExams = catchAsyncErrors(async (req, res, next) => {
	const exams = await Exam.find(
		{ user: req.user.id },
		"name isComplete score createdAt",
	).populate("test");

	res.status(200).json({
		success: true,
		exams,
	});
});
// get a exam's details( for user)
exports.getUserExamDetails = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findOne({
		user: req.user.id,
		_id: req.params.id,
	})
		.populate("test")
		.populate("user")
		.populate({
			path: "modules",
			populate: {
				path: "questions",
				populate: {
					path: "question",
					select: "+options.answer +options.reason",
					populate: {
						path: "module",
					},
				},
			},
		})
		.select("+modules.questions.isCorrect")
		.select("+modules.questions.reason")
		.select(
			"+result_careless_math +result_careless_verbal +result_overtime_math +result_script_skills_verbal +result_script_subjects_math +result_script_subjects_verbal",
		);

	if (!exam) {
		return next(new ErrorHandler("Exam not found", 404));
	}

	const modules = await Module.find({ test: exam.test.id });

	const modulesQuestions = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				test: exam.test.id,
				module: module.id,
			})
				.sort({ questionNumber: 1 })
				.select("+options.answer")
				.select("+options.reason");

			return {
				...module.toObject(),
				questions,
			};
		}),
	);

	res.status(200).json({
		success: true,
		exam: {
			...exam.toObject(),
			test: {
				...exam.test.toObject(),
				modules: modulesQuestions,
			},
		},
	});
});

//complete a exam
exports.completeExam = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findOne({
		_id: req.params.id,
		user: req.user.id,
	})
		.populate("test")
		.select("+modules.questions.isCorrect");

	if (!exam) return next(new ErrorHandler("Test not found", 404));

	if (exam.isComplete)
		return next(new ErrorHandler("Test completed before", 400));

	const modules = await Module.find({ test: exam.test });

	const missingModules = modules.filter(
		(module) =>
			!exam.modules.some((examModule) =>
				examModule.module.equals(module._id),
			),
	);

	if (missingModules.length > 0) {
		return next(
			new ErrorHandler("Some modules are missing in the test", 400),
		);
	}

	for (const module of exam.modules) {
		const allQuestionsAnswered = module.questions.every(
			(question) => question.hasAnswered,
		);

		if (!allQuestionsAnswered) {
			return next(
				new ErrorHandler(
					"All questions in the modules must be answered",
					400,
				),
			);
		}
	}

	// Complete the test
	exam.isComplete = true;
	

	await exam.save();

	return res.status(200).json({
		success: true,
		message: "Test completed successfully",
		exam,
	});
});

// get a exam's details( for admin)
exports.getExamDetails = catchAsyncErrors(async (req, res, next) => {
	const exam = await Exam.findById(req.params.id)
		.populate("test")
		.populate("user")
		.populate({
			path: "modules",
			populate: {
				path: "questions",
				populate: {
					path: "question",
					select: "+options.answer +options.reason",
					populate: {
						path: "module",
					},
				},
			},
		})

		.select("+modules.questions.isCorrect")
		.select("+modules.questions.reason")
		.select(
			"+result_careless_math +result_careless_verbal +result_overtime_math +result_script_skills_verbal +result_script_subjects_math +result_script_subjects_verbal",
		);


	if (!exam) {
		return next(new ErrorHandler("Exam not found", 404));
	}

	const modules = await Module.find({ test: exam.test.id });

	const modulesQuestions = await Promise.all(
		modules.map(async (module) => {
			const questions = await Question.find({
				test: exam.test.id,
				module: module.id,
			})
				.sort({ questionNumber: 1 })
				.select("+options.answer")
				.select("+options.reason");

			return {
				...module.toObject(),
				questions,
			};
		}),
	);

	res.status(200).json({
		success: true,
		exam: {
			...exam.toObject(),
			test: {
				...exam.test.toObject(),
				modules: modulesQuestions,
			},
		},
	});
});
exports.updateExamScores = catchAsyncErrors(async (req, res, next) => {
	const { score, mathScore, verbalScore } = req.body;
	if (score === undefined || score === null) {
		return next(new ErrorHandler("Please provide score", 400));
	}

	let exam = await Exam.findById(req.params.id);

	if (!exam) {
		return next(new ErrorHandler("Exam not found", 404));
	}

	exam.score = score;

	if (mathScore) {
		exam.mathScore = mathScore;
	}

	if (verbalScore) {
		exam.verbalScore = verbalScore;
	}

	exam = await exam.save();

	res.status(200).json({
		success: true,
		exam
	});
});

exports.updateExamResults = catchAsyncErrors(async (req, res, next) => {
	const {
		result_careless_math,
		result_careless_verbal,
		result_overtime_math,
		result_script_skills_verbal,
		result_script_subjects_math,
		result_script_subjects_verbal
	} = req.body;

	let exam = await Exam.findById(req.params.id);

	if (!exam) {
		return next(new ErrorHandler("Exam not found", 404));
	}

	exam.result_careless_math = result_careless_math;
	exam.result_careless_verbal = result_careless_verbal;
	exam.result_overtime_math = result_overtime_math;
	exam.result_script_skills_verbal = result_script_skills_verbal;
	exam.result_script_subjects_math = result_script_subjects_math;
	exam.result_script_subjects_verbal = result_script_subjects_verbal;

	exam = await exam.save();

	res.status(200).json({
		success: true,
		exam
	});
});

// get all tests(as a admin)

exports.getUserAllExams = catchAsyncErrors(async (req, res, next) => {
	const exams = await Exam.find({}, "user name isComplete createdAt score")
		.sort({ createdAt: 1 })
		.populate("test")
		.populate("user")
		.exec();

	res.status(200).json({
		success: true,
		exams,
	});
});

exports.getCompletionCount = async (req, res) => {
	try {
		const completedTestsCount = await Exam.aggregate([
			{ $match: { isComplete: true, test: { $ne: null } } },
			{
				$lookup: {
					from: "tests", // replace with the actual name of your test collection
					localField: "test",
					foreignField: "_id",
					as: "test",
				},
			},
			{ $unwind: "$test" },
			{ $group: { _id: "$test.name", count: { $sum: 1 } } },
		]);

		res.json(completedTestsCount);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
