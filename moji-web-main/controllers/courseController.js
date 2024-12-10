const User = require("../models/User");
const Course = require("../models/Course");
const moment = require("moment");

module.exports.getCourse = (req, res) => {
  try {
    Course.find({})
      .lean()
      .then((courses) => {
        const updatedCourses = courses.map((course) => {
          if (
            course.flash_sale &&
            course.flash_sale.is_active &&
            moment().isBefore(course.flash_sale.end_date)
          ) {
            return {
              ...course,
              price: course.price - course.flash_sale.discount_amount,
            };
          }

          console.log(course);
          return course;
        });

        res
          .status(200)
          .json({ message: "Found all the courses", course: updatedCourses });
      })
      .catch((error) => {
        console.error("Error fetching courses: ", error.message);
        res.status(400).json({
          message: "Failed to retrieve courses",
          error:
            "Unable to fetch courses at this time. Please try again later.",
        });
      });
  } catch (error) {}
};

module.exports.viewCourse = (req, res) => {
  const { courseId } = req.params;

  Course.findById(courseId)
    .lean()
    .then((course) => {
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      if (
        course.flash_sale &&
        course.flash_sale.is_active &&
        moment().isBefore(course.flash_sale.end_date)
      ) {
        course.price = course.price - course.flash_sale.discount_amount; // Apply flash sale discount
      }

      res.status(200).json({
        message: "Successfully found course for viewing",
        course,
      });
    })
    .catch((error) => {
      console.error("Error fetching course:", error.message);
      res.status(400).json({
        message: "Failed to retrieve course for viewing",
        error: "Unable to fetch the course. Please try again later.",
      });
    });
};

module.exports.createCourse = (req, res) => {
  const coursesData = req.body;

  Course.insertMany(coursesData)
    .then((newCourses) => {
      console.log("Courses created:", newCourses);

      res.status(201).json({
        message: "Courses created successfully",
        courses: newCourses,
      });
    })
    .catch((error) => {
      console.error("Error creating courses:", error.message);
      res.status(400).json({
        message: "Failed to create courses",
        error: "Invalid input or server error",
      });
    });
};

module.exports.editCourse = (req, res) => {
  const { courseId } = req.params;
  const updateData = req.body;

  Course.findByIdAndUpdate(courseId, updateData, {
    new: true, // Return the updated document
    runValidators: true, // Validate before updating
  })
    .lean()
    .then((updatedCourse) => {
      if (!updatedCourse) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      console.log(updatedCourse);

      res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    })
    .catch((error) => {
      console.error("Error updating course:", error.message);
      res.status(400).json({
        message: "Failed to update course",
        error: "Invalid input or server error",
      });
    });
};

module.exports.deleteCourse = (req, res) => {
  const { courseId } = req.params;

  Course.findByIdAndDelete(courseId)
    .lean()
    .then((deletedCourse) => {
      if (!deletedCourse) {
        return res.status(404).json({
          message: "Course not found",
        });
      }
      res.status(200).json({
        message: "Course deleted successfully",
        course: deletedCourse,
      });
    })
    .catch((error) => {
      console.error("Error deleting course:", error.message);
      res.status(400).json({
        message: "Failed to delete course",
        error: "Server error occurred while deleting the course",
      });
    });
};
