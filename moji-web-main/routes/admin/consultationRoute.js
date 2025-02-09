const express = require("express");
const router = express.Router();
const {
  getAllConsultations,
  updateConsultationStatus,
} = require("../../controllers/admin/adminConsultationController");
const {
  isAuthenticatedUser,
  authorizedRole,
} = require("../../middlewares/auth");

// Get all consultations
router
  .route("/consultations")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllConsultations);

// Update consultation status
router
  .route("/consultations/:id")
  .patch(
    isAuthenticatedUser,
    authorizedRole("admin"),
    updateConsultationStatus
  );

module.exports = router;
