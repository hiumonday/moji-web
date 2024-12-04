const express = require("express");
const {
    createDailySummarizeResult,
    getAllDailyScores,
    getOwnDailyAllSummary,
    getDailyLeaderboard,
    getDailyResult,
    getDailyPassage,
    doneDaily
} = require("../controllers/dailySummarizeController.js");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");

const router = express.Router();

// Passages routes

router.route("/daily").get(isAuthenticatedUser, getDailyPassage); 
router.route('/daily/:id').post(isAuthenticatedUser, createDailySummarizeResult);
router.route("/daily_results/:id").get(isAuthenticatedUser, getDailyResult);
router.route("/daily-leaderboard/:dayNumber").get(isAuthenticatedUser, getDailyLeaderboard);


router.route("/me/own-daily/:id").get(isAuthenticatedUser, getOwnDailyAllSummary);
router.route("/me/daily-percentile/:dayNumber").get(isAuthenticatedUser, getAllDailyScores);
router.route("/done-daily").get(isAuthenticatedUser, doneDaily);



module.exports = router;
