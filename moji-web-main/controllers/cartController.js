const User = require("../models/User");
const Course = require("../models/Course");

// Add course to cart
module.exports.viewCart = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .populate("cart.courseId")
    .then((user) => {
      res.status(200).json({ cart: user.cart });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching cart", error });
    });
};

module.exports.addCourseToCart = (req, res) => {
  const { courseId } = req.body;
  const { userId } = req.user._id;

  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      return User.findById(userId);
    })
    .then((user) => {
      if (user.cart.some((item) => item.courseId.toString() === courseId)) {
        return res.status(400).json({ message: "Course already in cart" });
      }

      user.cart.push({ courseId });
      return user.save();
    })
    .then((updatedUser) => {
      res
        .status(200)
        .json({ message: "Course added to cart", cart: updatedUser.cart });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error adding course to cart", error });
    });
};

module.exports.removeCourseFromCart = (req, res) => {
  const { courseId } = req.body;
  const { userId } = req.user._id;

  User.findById(userId)
    .then((user) => {
      user.cart = user.cart.filter(
        (item) => item.courseId.toString() !== courseId
      );
      return user.save();
    })
    .then((updatedUser) => {
      res
        .status(200)
        .json({ message: "Course removed from cart", cart: updatedUser.cart });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error removing course from cart", error });
    });
};

module.exports.demoApiForwarding = (req, res) => {
  console.log("Successfully");
  res.json({ message: "Forwarded api" });
};
