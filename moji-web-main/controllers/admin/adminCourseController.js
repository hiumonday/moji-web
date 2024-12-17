const Course = require("../../models/Course");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

// Get all courses
exports.getAllCourses = catchAsyncErrors(async (req, res, next) => {
  const courses = await Course.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    courses,
  });
});

// Create new course
exports.createCourse = catchAsyncErrors(async (req, res, next) => {
  const courseData = req.body;

  // Validate required fields
  if (!courseData.title || !courseData.price || !courseData.earlyBirdPrice) {
    return next(
      new ErrorHandler(
        "Title, price, and early bird price are required fields",
        400
      )
    );
  }

  // Validate classes if provided
  if (courseData.classes && courseData.classes.length > 0) {
    const requiredClassFields = [
      "level",
      "language",
      "teacherName",
      "day",
      "startTime",
      "endTime",
    ];

    for (const classItem of courseData.classes) {
      for (const field of requiredClassFields) {
        if (!classItem[field]) {
          return next(
            new ErrorHandler(`${field} is required for each class`, 400)
          );
        }
      }
    }
  }

  const course = await Course.create(courseData);

  res.status(201).json({
    success: true,
    course,
  });
});

// Update course
exports.updateCourse = catchAsyncErrors(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    course,
  });
});

// Delete course
exports.deleteCourse = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

// Get single course
exports.getCourse = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  res.status(200).json({
    success: true,
    course,
  });
});

// Get course classes
exports.getCourseClasses = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  res.status(200).json({
    success: true,
    classes: course.classes,
  });
});

// Add class to course
exports.addClass = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  const classData = req.body;
  const requiredFields = [
    "level",
    "language",
    "teacherName",
    "day",
    "startTime",
    "endTime",
  ];

  for (const field of requiredFields) {
    if (!classData[field]) {
      return next(new ErrorHandler(`${field} is required`, 400));
    }
  }

  course.classes.push(classData);
  await course.save();

  res.status(200).json({
    success: true,
    course,
  });
});

// Update class
exports.updateClass = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  const classIndex = course.classes.findIndex(
    (c) => c._id.toString() === req.params.classId
  );

  if (classIndex === -1) {
    return next(new ErrorHandler("Class not found", 404));
  }

  course.classes[classIndex] = {
    ...course.classes[classIndex].toObject(),
    ...req.body,
  };

  await course.save();

  res.status(200).json({
    success: true,
    course,
  });
});

// Delete class
exports.deleteClass = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  course.classes = course.classes.filter(
    (c) => c._id.toString() !== req.params.classId
  );

  await course.save();

  res.status(200).json({
    success: true,
    course,
  });
});

// Add this new controller function
exports.toggleCoursePublishStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Toggle the is_active status
    course.is_active = !course.is_active;
    await course.save();

    res.status(200).json({
      success: true,
      message: course.is_active
        ? "Course published successfully"
        : "Course unpublished successfully",
      course,
    });
  } catch (error) {
    console.error("Toggle publish error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to toggle course status", 500)
    );
  }
});
