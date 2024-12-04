const express = require("express");
const {
  createPassage,
  getPassages,
  getPassageDetails,
  updatePassage,
  deletePassage,
  getGamePassage,
  getOwnAllSummary,
  createUserSkills,
  createSummaryResult,
  getSummaryResult,
  getLeaderboard,
  getAllScores
} = require("../controllers/passageController.js");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");

const router = express.Router();

// Passages routes
router.route("/admin/passages").post(isAuthenticatedUser, createPassage); // Create a new passage
router.route("/admin/passages").get(isAuthenticatedUser, getPassages); // Get all passages
router.route("/admin/passages/:id").get(isAuthenticatedUser, getPassageDetails); // Get a specific passage
router.route("/admin/passages/:id").put(isAuthenticatedUser, updatePassage); // Update a passage
router.route("/admin/passages/:id").delete(isAuthenticatedUser, authorizedRole("admin"), deletePassage); // Delete a passage
router.route("/passages/:id").get(isAuthenticatedUser, getGamePassage); 
router.route("/skills/:id").post(isAuthenticatedUser, createUserSkills); 
router.route('/summary/:id').post(isAuthenticatedUser, createSummaryResult);
router.route("/summary_results/:id").get(isAuthenticatedUser, getSummaryResult);
router.route("/leaderboard").get(isAuthenticatedUser, getLeaderboard);


router.route("/me/own-summary/:id").get(isAuthenticatedUser, getOwnAllSummary);
router.route("/me/percentile").get(isAuthenticatedUser, getAllScores);


module.exports = router;
