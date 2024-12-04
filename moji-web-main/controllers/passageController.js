const Passage = require("../models/Passage");
const UserSkills = require("../models/UserSkills");
const summarizeResults = require("../models/SummarizeResults");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc      Create a new passage
// @route     POST /admin/passages
// @access    Private (Admin)
const createPassage = async (req, res) => {
  try {
    const passage = await Passage.create(req.body);
    res.status(201).json({ success: true, data: passage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const { passageIds } = req.body;

    const userSkills = await UserSkills.create({ userId, passageIds });

    res.status(201).json({ success: true, data: userSkills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc      Get all passages
// @route     GET /admin/passages
// @access    Private
const getPassages = async (req, res) => {
  try {
    const passages = await Passage.find();
    res.status(200).json({ success: true, data: passages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc      Get details of a specific passage
// @route     GET /admin/passages/:id
// @access    Private
const getPassageDetails = async (req, res) => {
  try {
    const passage = await Passage.findById(req.params.id);
    if (!passage) {
      return res.status(404).json({ success: false, error: "Passage not found" });
    }
    res.status(200).json({ success: true, data: passage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc      Update a passage
// @route     PUT /admin/passages/:id
// @access    Private
const updatePassage = async (req, res) => {
  try {
    const passage = await Passage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!passage) {
      return res.status(404).json({ success: false, error: "Passage not found" });
    }
    res.status(200).json({ success: true, data: passage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc      Delete a passage
// @route     DELETE /admin/passages/:id
// @access    Private (Admin)
const deletePassage = async (req, res) => {
  try {
    const passage = await Passage.findByIdAndDelete(req.params.id);
    if (!passage) {
      return res.status(404).json({ success: false, error: "Passage not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getGamePassage = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Assuming you have a UserSkills model with a field named 'passageIds'
    const userSkills = await UserSkills.findOne({ userId });
    const excludedIds = userSkills ? userSkills.passageIds : [];

    const getRandomPassage = async (difficulty, excludedIds) => {
      const count = await Passage.countDocuments({
        difficulty,
        _id: { $nin: excludedIds },
      });
      const randomIndex = Math.floor(Math.random() * count);
      return Passage.findOne({
        difficulty,
        _id: { $nin: excludedIds },
      }).skip(randomIndex);
    };

    const easyPassage = await getRandomPassage("easy", excludedIds);
    const mediumPassage = await getRandomPassage("medium", excludedIds);
    const hardPassage = await getRandomPassage("hard", excludedIds);

    res.status(200).json({
      success: true,
      data: { easy: easyPassage, medium: mediumPassage, hard: hardPassage },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getOwnAllSummary = async (req, res) => {
  try {
    const exams = await summarizeResults.find({ user: req.user.id })
      .select('score _id createdAt'); // only retrieve the 'score', '_id', and 'createdAt' fields

    res.status(200).json({
      exams
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createSummaryResult = async (req, res) => {
  try {
    const { user, score, easy, medium, hard, comments } = req.body;

    const summaryResult = await summarizeResults.create({
      user,
      easy: {
        score: easy.score,
        passage: easy.passage,
        highlight: easy.highlight
      },
      medium: {
        score: medium.score,
        passage: medium.passage,
        highlight: medium.highlight
      },
      hard: {
        score: hard.score,
        passage: hard.passage,
        highlight: hard.highlight
      },
      score,
      comments
    });

    res.status(201).json({ success: true, data: summaryResult, id: summaryResult._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getSummaryResult = async (req, res) => {
  try {
    const summaryResult = await summarizeResults
      .findById(req.params.id)
      .populate('easy.passage')
      .populate('medium.passage')
      .populate('hard.passage');

    if (!summaryResult) {
      return res.status(404).json({ success: false, error: "Summary Result not found" });
    }
    res.status(200).json({ success: true, data: summaryResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const pageSize = 10;
    const pageNumber = 1;
    const topScores = await summarizeResults
      .find({}, 'score') // only retrieve the 'score' field
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

const getAllScores = async (req, res) => {
  try {
    const scoreDocuments = await summarizeResults
      .find({}, 'score') // only retrieve the 'score' field
      .sort({ score: -1 });

    if (!scoreDocuments) {
      return res.status(404).json({ success: false, error: "No scores found" });
    }

    // Map over the documents and return only the 'score' field
    const scores = scoreDocuments.map(doc => doc.score);

    res.status(200).json({ success: true, data: scores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  createPassage,
  getPassages,
  getPassageDetails,
  updatePassage,
  getGamePassage,
  deletePassage,
  createUserSkills,
  createSummaryResult,
  getSummaryResult,
  getLeaderboard,
  getOwnAllSummary,
  getAllScores

};
