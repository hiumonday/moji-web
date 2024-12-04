const Passage = require("../models/Passage");
const dailySummarizeResults = require("../models/dailySummarizeResults");

const Test = require('../models/Test'); // Import the Test model
const Exam = require('../models/Exam'); // Import the Exam model



const getDailyPassage = async (req, res) => {
    try {
        // Get the IDs of the tests that the user has already completed
        const completedTestIds = await Exam.find({ user: req.user._id, isComplete: true }).distinct('test');

        // Find a test where the daily field exists and is a number, and sort in ascending order
        // Exclude the tests that the user has already completed
        const dailyTest = await Test.find({ 
            daily: { $exists: true, $type: 'number' },
            _id: { $nin: completedTestIds }
        }).sort({ daily: 1 }).limit(1);

        if (!dailyTest.length) {
            return res.status(404).json({ success: false, message: "No daily test available." });
        }

        // Return the test's ID
        res.status(200).json({
            success: true,
            data: { testId: dailyTest[0]._id },
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error.message });
    }
};

const doneDaily = async (req, res) => {
    const eighteenHoursAgo = new Date(Date.now() - 18 * 60 * 60 * 1000);

    const recentCompletedExam = await Exam.findOne({
        user: req.user._id,
        isComplete: true,
        createdAt: { $gte: eighteenHoursAgo }
    }).populate({
        path: 'test',
        match: { daily: { $exists: true, $ne: null } }
    });

    if (recentCompletedExam && recentCompletedExam.test) { 
        res.status(200).json({  data: true });
    }
    else {
        res.status(200).json({ data: false });
    }
};



const getDailyResult = async (req, res) => {
    try {
        const resultId = req.params.id;
        const result = await dailySummarizeResults
            .findById(resultId)
            .populate('passage');

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getDailyLeaderboard = async (req, res) => {
    try {
        const pageSize = 10;
        const pageNumber = 1;

        const dayNumber = req.params.dayNumber; // get dayNumber from the route parameters
        const topScores = await dailySummarizeResults
            .find({ dayNumber }, 'score') // only retrieve the 'score' field for the current day
            .populate('user', 'name') // replace 'user' with the 'name' field from the 'user' collection
            .sort({ score: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        if (!topScores) {
            return res.status(404).json({ success: false, error: "No scores found" });
        }
        res.status(200).json({ success: true, data: topScores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
  

const getOwnDailyAllSummary = async (req, res) => {
    try {
      const exams = await dailySummarizeResults.find({ user: req.user.id })
        .select('score _id createdAt'); // only retrieve the 'score', '_id', and 'createdAt' fields
  
      res.status(200).json({
        exams
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };


const getAllDailyScores = async (req, res) => {
    try {
        const dayNumber = req.params.dayNumber; // get dayNumber from the route parameters

        const scores = await dailySummarizeResults
            .find({ dayNumber }, 'score') // only retrieve the 'score' field for the current day
            .sort({ score: -1 });

        if (!scores || scores.length === 0) {
            return res.status(404).json({ success: false, error: "No scores found" });
        }

        // Extract only the scores from the returned documents
        const scoreValues = scores.map(doc => doc.score);

        res.status(200).json({ success: true, data: scoreValues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
const createDailySummarizeResult = async (req, res, next) => {
    try {
        const { comments, user, score, passage, highlight, dayNumber } = req.body;

        const result = new dailySummarizeResults({
            comments,
            user,
            score,
            passage,
            highlight,
            dayNumber
        });

        await result.save();

        res.status(201).json({
            success: true,
            result
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    createDailySummarizeResult,
    getAllDailyScores,
    getOwnDailyAllSummary,
    getDailyLeaderboard,
    getDailyResult,
    getDailyPassage,
    doneDaily
  };
  