const express = require("express");
const {
  getAllTournaments,
  createTournament,
  getTournamentById,
  updateTournament,
  deleteTournament,
  togglePublishStatus,
} = require("../../controllers/admin/tournamentController");
const { isAuthenticatedUser, authorizedRole } = require("../../middlewares/auth");
const imageUpload = require("../../middlewares/imageUpload");

const router = express.Router();

router
  .route("/tournaments")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllTournaments)
  .post(isAuthenticatedUser, authorizedRole("admin"), imageUpload.single("banner"), createTournament);

router
  .route("/tournaments/:id")
  .get(isAuthenticatedUser, authorizedRole("admin"), getTournamentById)
  .put(isAuthenticatedUser, authorizedRole("admin"), imageUpload.single("banner"), updateTournament)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteTournament);

router
    .route("/tournaments/:id/toggle-publish")
    .put(isAuthenticatedUser, authorizedRole("admin"), togglePublishStatus);

module.exports = router; 