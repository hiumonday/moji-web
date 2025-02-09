const express = require("express");
const courseController = require("../controllers/courseController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// View cart
router.get("/courses", courseController.getCourse);
// Add course to cart
router.get("/courses/:courseId", courseController.viewCourseDetail);

//Create Course
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post(
  "/courses/create",
  upload.single("image"),
  courseController.createCourse
);

module.exports = router;
