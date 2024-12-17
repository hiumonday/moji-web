const express = require("express");
const {
  isAuthenticatedUser,
  authorizedRole,
} = require("../../middlewares/auth");
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  getCourseClasses,
  addClass,
  updateClass,
  deleteClass,
  toggleCoursePublishStatus,
} = require("../../controllers/admin/adminCourseController");

const router = express.Router();

// Make sure this route is defined before the more general routes
router.patch(
  "/courses/:id/toggle-publish",
  isAuthenticatedUser,
  authorizedRole("admin"),
  toggleCoursePublishStatus
);

// Course routes
router
  .route("/courses")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllCourses)
  .post(isAuthenticatedUser, authorizedRole("admin"), createCourse);

router
  .route("/courses/:id")
  .get(isAuthenticatedUser, authorizedRole("admin"), getCourse)
  .put(isAuthenticatedUser, authorizedRole("admin"), updateCourse)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteCourse);

// Class routes
router
  .route("/courses/:id/classes")
  .get(isAuthenticatedUser, authorizedRole("admin"), getCourseClasses)
  .post(isAuthenticatedUser, authorizedRole("admin"), addClass);

router
  .route("/courses/:courseId/classes/:classId")
  .put(isAuthenticatedUser, authorizedRole("admin"), updateClass)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteClass);

module.exports = router;
