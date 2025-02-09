const express = require("express");
const { getEnrolledCourses } = require("../controllers/myCourseController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/my-courses").get(isAuthenticatedUser, getEnrolledCourses);

module.exports = router;
