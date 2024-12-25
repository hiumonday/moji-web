const User = require("../models/User");
const Course = require("../models/Course");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

module.exports.getCourse = async (req, res) => {
  try {
    // Fetch all courses
    const courses = await Course.find().lean();

    // Format response to include specific information and image as base64
    const formattedCourses = courses.map((course) => {
      let imageBase64 = null;
      if (course.image && course.image.data) {
        imageBase64 = `data:${
          course.image.contentType
        };base64,${course.image.data.toString("base64")}`;
      }

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        earlyBirdPrice: course.earlyBirdPrice,
        earlyBirdSlot: course.earlyBirdSlot,
        classes: course.classes,
        image: imageBase64,
      };
    });

    // Return formatted courses
    res.status(200).json({
      message: "Courses fetched successfully",
      data: formattedCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

module.exports.viewCourseDetail = (req, res) => {
  const { courseId } = req.params;

  Course.findById(courseId)
    .lean()
    .then((course) => {
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      let imageBase64 = null;
      if (course.image && course.image.data) {
        imageBase64 = `data:${
          course.image.contentType
        };base64,${course.image.data.toString("base64")}`;
      }

      const courseWithImage = {
        _id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        earlyBirdPrice: course.earlyBirdPrice,
        earlyBirdSlot: course.earlyBirdSlot,
        classes: course.classes,
        image: imageBase64,
      };

      // Send the response
      res.status(200).json({
        message: "Successfully found course for viewing",
        course: courseWithImage,
      });
    })
    .catch((error) => {
      console.error("Error fetching course:", error.message);
      res.status(500).json({
        message: "Failed to retrieve course for viewing",
        error: "Unable to fetch the course. Please try again later.",
      });
    });
};

module.exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      earlyBirdPrice,
      earlyBirdSlot,
      discounts,
      classes,
      learning_platform,
    } = req.body;

    // Validate required fields
    if (!title || !price || !earlyBirdPrice) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Parse classes and discounts if they are sent as JSON strings
    const parsedClasses = classes ? JSON.parse(classes) : [];
    const parsedDiscounts = discounts ? JSON.parse(discounts) : [];

    // Handle image (if uploaded)
    let imageData = null;
    if (req.file) {
      imageData = {
        data: req.file.buffer, // Store image data as a Buffer
        contentType: req.file.mimetype, // Store MIME type (e.g., "image/jpeg")
      };
    }

    // Create new course object
    const newCourse = new Course({
      title,
      description,
      price,
      earlyBirdPrice,
      earlyBirdSlot: earlyBirdSlot || 5,
      discounts: parsedDiscounts,
      classes: parsedClasses,
      learning_platform: learning_platform || null,
      image: imageData,
    });

    // Save course to the database
    await newCourse.save();

    // Send success response
    res
      .status(201)
      .json({ message: "Course created successfully!", course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
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
