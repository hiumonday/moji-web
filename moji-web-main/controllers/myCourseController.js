const User = require("../models/User");
const Course = require("../models/Course");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Get enrolled courses for the logged-in user
exports.getEnrolledCourses = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "purchasedCourses.courseId",
      select: "title description price level classes",
    });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Transform the data to match the frontend requirements
  const enrolledCourses = user.purchasedCourses.map((purchase) => {
    // Find the matching class from the course's classes array
    const courseClass = purchase.courseId?.classes?.find(
      (cls) => cls._id.toString() === purchase.classId.toString()
    );

    return {
      id: purchase._id || purchase.courseId?._id,
      courseId: {
        title: purchase.courseId?.title || "",
        instructor: courseClass?.teacherName || "",
        duration: `${courseClass?.startTime || ""} - ${courseClass?.endTime || ""}`,
        level: courseClass?.level || "",
      },
      classId: {
        name: `${purchase.courseId?.title || ""} - ${courseClass?.level || ""}`,
        teacherName: courseClass?.teacherName || "",
        studyTime: `${courseClass?.startTime || ""} - ${courseClass?.endTime || ""}`,
        day: courseClass?.day || "",
        startTime: courseClass?.startTime || "",
        endTime: courseClass?.endTime || "",
        learning_platform: courseClass?.learning_platform || {
          platform: "",
          access_code: "",
          access_link: "",
        },
      },
      participants: purchase.participants?.map((participant) => ({
        name: participant?.name || "",
        dateOfBirth: participant?.dateOfBirth || "",
      })) || [],
    };
  });

  res.status(200).json({
    success: true,
    enrolledCourses,
  });
});
