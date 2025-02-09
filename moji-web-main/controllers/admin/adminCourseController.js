const Course = require("../../models/Course");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

// Get all courses
exports.getAllCourses = catchAsyncErrors(async (req, res, next) => {
  const courses = await Course.find().sort({ createdAt: -1 });

  // Convert courses to plain objects and include image data
  const coursesWithImages = courses.map((course) => {
    const courseObj = course.toObject();
    if (courseObj.image && courseObj.image.data) {
      // Convert binary data to base64 string
      courseObj.image.data = courseObj.image.data.toString("base64");
      return courseObj;
    }
    return courseObj;
  });

  res.status(200).json({
    success: true,
    courses: coursesWithImages,
  });
});

// Create new course
exports.createCourse = catchAsyncErrors(async (req, res, next) => {
  try {
    const courseData = { ...req.body };

    // Parse JSON strings back to objects
    if (typeof courseData.classes === "string") {
      courseData.classes = JSON.parse(courseData.classes);
    }
    if (typeof courseData.discounts === "string") {
      courseData.discounts = JSON.parse(courseData.discounts);
    }
    if (typeof courseData.learning_platform === "string") {
      courseData.learning_platform = JSON.parse(courseData.learning_platform);
    }

    // Handle image upload
    if (req.file) {
      courseData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Validate required fields based on course type
    if (!courseData.title) {
      return next(new ErrorHandler("Title is a required field", 400));
    }

    // Additional validation for non-contact based courses
    if (courseData.type === "non_contact_based") {
      if (!courseData.price || !courseData.earlyBirdPrice) {
        return next(
          new ErrorHandler(
            "Price and early bird price are required for non-contact based courses",
            400
          )
        );
      }
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
        const missingFields = requiredClassFields.filter(
          (field) => !classItem[field]
        );
        if (missingFields.length > 0) {
          return next(
            new ErrorHandler(
              `Missing required fields for class: ${missingFields.join(", ")}`,
              400
            )
          );
        }
      }
    }

    // Set is_active based on whether it's being published or saved as draft
    courseData.is_active =
      courseData.is_active === "true" || courseData.is_active === true;

    const course = await Course.create(courseData);

    // Don't send image data in response
    const courseResponse = course.toObject();
    if (courseResponse.image) {
      courseResponse.imageUrl = `/api/v1/admin/courses/${course._id}/image`;
      delete courseResponse.image;
    }

    res.status(201).json({
      success: true,
      message: courseData.is_active
        ? "Course created and published successfully"
        : "Course saved as draft",
      course: courseResponse,
    });
  } catch (error) {
    console.error("Create course error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to create course", 500)
    );
  }
});

// Update course
exports.updateCourse = catchAsyncErrors(async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const updateData = { ...req.body };

    // Parse JSON strings back to objects
    if (typeof updateData.classes === "string") {
      updateData.classes = JSON.parse(updateData.classes);
    }
    if (typeof updateData.discounts === "string") {
      updateData.discounts = JSON.parse(updateData.discounts);
    }
    if (typeof updateData.learning_platform === "string") {
      updateData.learning_platform = JSON.parse(updateData.learning_platform);
    }

    // Handle image upload
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Convert the updated course to object and include base64 image data
    const courseResponse = course.toObject();
    if (courseResponse.image && courseResponse.image.data) {
      courseResponse.image.data = courseResponse.image.data.toString("base64");
    }

    res.status(200).json({
      success: true,
      course: courseResponse,
    });
  } catch (error) {
    console.error("Update course error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to update course", 500)
    );
  }
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

// Add a new endpoint to serve course images
exports.getCourseImage = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course || !course.image || !course.image.data) {
    return next(new ErrorHandler("Image not found", 404));
  }

  res.set("Content-Type", course.image.contentType);
  res.send(course.image.data);
});
