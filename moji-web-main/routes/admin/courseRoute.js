const express = require("express");
const router = express.Router();
const imageUpload = require("../../middlewares/imageUpload");

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

const {
  isAuthenticatedUser,
  authorizedRole,
} = require("../../middlewares/auth");

// Course routes
router
  .route("/courses")
  .get(isAuthenticatedUser, authorizedRole("admin"), getAllCourses)
  .post(
    isAuthenticatedUser,
    authorizedRole("admin"),
    imageUpload.single("image"),
    createCourse
  );

router
  .route("/courses/:id")
  .get(isAuthenticatedUser, authorizedRole("admin"), getCourse)
  .put(
    isAuthenticatedUser,
    authorizedRole("admin"),
    imageUpload.single("image"),
    updateCourse
  )
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteCourse);

// Other existing routes...
router.patch(
  "/courses/:id/toggle-publish",
  isAuthenticatedUser,
  authorizedRole("admin"),
  toggleCoursePublishStatus
);

router
  .route("/courses/:id/classes")
  .get(isAuthenticatedUser, authorizedRole("admin"), getCourseClasses)
  .post(isAuthenticatedUser, authorizedRole("admin"), addClass);

router
  .route("/courses/:courseId/classes/:classId")
  .put(isAuthenticatedUser, authorizedRole("admin"), updateClass)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteClass);

module.exports = router;
