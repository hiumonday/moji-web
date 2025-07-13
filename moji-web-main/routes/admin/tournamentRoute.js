const express = require("express");
const {
  getAllTournaments,
  createTournament,
  getTournamentById,
  updateTournament,
  deleteTournament,
} = require("../../controllers/admin/tournamentController");
const { isAuthenticatedUser, authorizedRole } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/tournaments")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllTournaments)
  .post(isAuthenticatedUser, authorizedRole("admin"), createTournament);

router
  .route("/tournaments/:id")
  .get(isAuthenticatedUser, authorizedRole("admin"), getTournamentById)
  .put(isAuthenticatedUser, authorizedRole("admin"), updateTournament)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteTournament);

module.exports = router; 