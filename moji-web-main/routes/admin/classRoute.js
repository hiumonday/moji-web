const express = require("express");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizedRole,
} = require("../../middlewares/auth");
const {
  getAllClasses,
  removeStudent,
} = require("../../controllers/admin/classController");

router
  .route("/classes")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllClasses);

router
  .route("/classes/:classId/students/:studentId")
  .delete(isAuthenticatedUser, authorizedRole("admin"), removeStudent);

module.exports = router;
