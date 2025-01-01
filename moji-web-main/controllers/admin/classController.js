const Course = require("../../models/Course");
const User = require("../../models/User");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

// Get all classes across all courses
exports.getAllClasses = catchAsyncErrors(async (req, res, next) => {
  const courses = await Course.find({ "classes.0": { $exists: true } });

  let allClasses = [];

  for (const course of courses) {
    const classesWithDetails = course.classes.map((classItem) => {
      // Get all students enrolled in this class
      const students =
        course.classes.find(
          (c) => c._id.toString() === classItem._id.toString()
        )?.participants || [];

      return {
        _id: classItem._id,
        courseName: course.title,
        courseId: course._id,
        level: classItem.level,
        teacherName: classItem.teacherName,
        day: classItem.day,
        startTime: classItem.startTime,
        endTime: classItem.endTime,
        location: classItem.location,
        is_active: course.is_active,
        students: students.map((student) => ({
          _id: student.participantId,
          userId: student.user_id,
        })),
      };
    });

    allClasses = [...allClasses, ...classesWithDetails];
  }

  // Fetch student details for each class
  for (let classItem of allClasses) {
    const studentDetails = await Promise.all(
      classItem.students.map(async (student) => {
        const user = await User.findById(student.userId);
        const participant = user.purchasedCourses
          .find(
            (course) =>
              course.courseId.toString() === classItem.courseId.toString()
          )
          ?.participants.find(
            (p) => p._id.toString() === student._id.toString()
          );

        return {
          _id: student._id,
          name: participant?.name || "Unknown",
          dateOfBirth: participant?.dateOfBirth || "Unknown",
          registeredBy: user.name,
        };
      })
    );
    classItem.students = studentDetails;
  }

  res.status(200).json({
    success: true,
    classes: allClasses,
  });
});

// Remove student from class
exports.removeStudent = catchAsyncErrors(async (req, res, next) => {
  const { classId, studentId } = req.params;

  const course = await Course.findOne({ "classes._id": classId });

  if (!course) {
    return next(new ErrorHandler("Class not found", 404));
  }

  // Find the class and remove the student from participants
  const classIndex = course.classes.findIndex(
    (c) => c._id.toString() === classId
  );
  if (classIndex === -1) {
    return next(new ErrorHandler("Class not found", 404));
  }

  const participantToRemove = course.classes[classIndex].participants.find(
    (p) => p.participantId.toString() === studentId
  );

  if (!participantToRemove) {
    return next(new ErrorHandler("Student not found in class", 404));
  }

  // Remove student from class participants
  course.classes[classIndex].participants = course.classes[
    classIndex
  ].participants.filter((p) => p.participantId.toString() !== studentId);

  // Remove the class from user's purchasedCourses
  const user = await User.findById(participantToRemove.user_id);
  if (user) {
    const purchasedCourseIndex = user.purchasedCourses.findIndex(
      (pc) => pc.courseId.toString() === course._id.toString()
    );

    if (purchasedCourseIndex !== -1) {
      user.purchasedCourses[purchasedCourseIndex].participants =
        user.purchasedCourses[purchasedCourseIndex].participants.filter(
          (p) => p._id.toString() !== studentId
        );

      if (
        user.purchasedCourses[purchasedCourseIndex].participants.length === 0
      ) {
        user.purchasedCourses.splice(purchasedCourseIndex, 1);
      }

      await user.save();
    }
  }

  await course.save();

  res.status(200).json({
    success: true,
    message: "Student removed from class successfully",
  });
});
