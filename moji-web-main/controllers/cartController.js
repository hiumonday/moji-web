const User = require("../models/User");
const Course = require("../models/Course");

// Add course to cart
module.exports.viewCart = (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  User.findById(userId)
    .populate("cart.courseId")
    .then((user) => {
      console.log(user.cart);
      res.status(200).json({ cart: user.cart });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching cart", error });
    });
};

module.exports.addCourseToCart = (req, res) => {
  const courseId = req.body.courseId;
  const user = req.user;
  const userId = user._id;
  console.log(req.body);

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
      if (!res.headersSent) {
        res
          .status(200)
          .json({ message: "Course added to cart", cart: updatedUser.cart });
      }
    })
    .catch((error) => {
      if (!res.headersSent) {
        res.status(500).json({ message: "Error adding course to cart", error });
      }
    });
};

module.exports.removeCourseFromCart = async (req, res) => {
  const userId = req.user._id; // ID của người dùng từ middleware xác thực
  const courseId = req.params.id; // Lấy courseId từ route parameter

  try {
    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sử dụng $pull để xóa khóa học khỏi giỏ hàng
    const result = await User.updateOne(
      { _id: userId },
      {
        $pull: {
          cart: { courseId: courseId }, // Xóa phần tử có courseId tương ứng
        },
      }
    );

    res.status(200).json({ message: "Course removed from cart successfully" });
  } catch (error) {
    console.error("Error removing course from cart:", error);
    res.status(500).json({
      message: "Error occurred while removing course from cart",
      error,
    });
  }
};

module.exports.demoApiForwarding = (req, res) => {
  console.log("Successfully");
  res.json({ message: "Forwarded api" });
};
