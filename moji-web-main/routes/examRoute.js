const express = require("express");
const {
	startExam,
	getModules,
	getTests,
	completeModule,
	skipModuleBreak,
	finishModuleBreak,
	completeExam,
	getExamDetails,
	getOwnAllExams,
	getUserAllExams,
	getUserExamDetails,
	getCompletionCount,
	updateExamScores,
	updateExamResults

} = require("../controllers/examController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");

const router = express.Router();


// routes
router.route("/exam/test/:id/start").get(isAuthenticatedUser, startExam);
router.route("/tests").get(isAuthenticatedUser, getTests);
router.route("/test/:id/modules").get(isAuthenticatedUser, getModules);
router
	.route("/exam/:id/:module/submit")
	.put(isAuthenticatedUser, completeModule);
router.route("/exam/:id/break/skip").get(isAuthenticatedUser, skipModuleBreak);
router
	.route("/exam/:id/break/finish")
	.get(isAuthenticatedUser, finishModuleBreak);
router.route("/exam/:id/complete").get(isAuthenticatedUser, completeExam);
router.route("/exam/:id").get(isAuthenticatedUser, getUserExamDetails);
router
	.route("/admin/exam/:id")
	.get(isAuthenticatedUser,getExamDetails);
router.route("/me/exams").get(isAuthenticatedUser, getOwnAllExams);
router
	.route("/admin/exams")
	.get(isAuthenticatedUser, authorizedRole("admin"), getUserAllExams);
router
	.route("/exams/completion-count")
	.get(isAuthenticatedUser, getCompletionCount); // add the new route

router
	.route("/exam/:id/scores")
	.put(isAuthenticatedUser, updateExamScores);

router
	.route("/exam/:id/results")
	.put(isAuthenticatedUser, updateExamResults);


module.exports = router;
