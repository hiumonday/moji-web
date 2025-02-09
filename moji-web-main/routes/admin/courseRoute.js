const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

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
  getCourseImage,
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
    upload.single("image"),
    createCourse
  );

router
  .route("/courses/:id")
  .get(isAuthenticatedUser, authorizedRole("admin"), getCourse)
  .put(
    isAuthenticatedUser,
    authorizedRole("admin"),
    upload.single("image"),
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
