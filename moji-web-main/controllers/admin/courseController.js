// Create new course
exports.createCourse = catchAsyncErrors(async (req, res, next) => {
  try {
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

    // Set is_active based on whether it's being published or saved as draft
    // If is_active is not explicitly set in the request, default to false (draft)
    courseData.is_active = Boolean(courseData.is_active);

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: courseData.is_active
        ? "Course created and published successfully"
        : "Course saved as draft",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    return next(
      new ErrorHandler(error.message || "Failed to create course", 500)
    );
  }
});
