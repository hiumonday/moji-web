const User = require("../models/User");
const Course = require("../models/Course");

module.exports.viewCart = async (req, res) => {
  const userId = req.user._id;
  console.log(req);

  try {
    const user = await User.findById(userId).populate("cart.courseId");

    const cartItems = user.cart.map((item) => {
      let imageBase64 = null;
      if (item.courseId.image && item.courseId.image.data) {
        imageBase64 = `data:${
          item.courseId.image.contentType
        };base64,${item.courseId.image.data.toString("base64")}`;
      }

      return {
        _id: item.courseId._id,
        title: item.courseId.title,
        description: item.courseId.description,
        price: item.courseId.price,
        earlyBirdPrice: item.courseId.earlyBirdPrice,
        earlyBirdSlot: item.courseId.earlyBirdSlot,
        classes: item.courseId.classes,
        image: imageBase64,
      };
    });

    const originalTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = cartItems.reduce((sum, item) => {
      let price = item.earlyBirdSlot > 0 ? item.earlyBirdPrice : item.price;
      if (
        user.appliedCoupon &&
        user.appliedCoupon.courseId.toString() === item._id.toString()
      ) {
        price -= (user.appliedCoupon.percentage / 100) * price;
      }
      return sum + price;
    }, 0);
    const discount = Math.round(
      ((originalTotal - totalPrice) / originalTotal) * 100
    );

    res
      .status(200)
      .json({ cart: cartItems, totalPrice, originalTotal, discount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

module.exports.addCourseToCart = (req, res) => {
  const { courseId, classId, participants } = req.body;
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

      user.cart.push({ courseId, classId, participants });
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

module.exports.applyCoupon = async (req, res) => {
  const userId = req.user._id;
  const { couponCode } = req.body; // Nhận mã giảm giá từ request body

  console.log(req.body);

  try {
    // Lấy thông tin người dùng và giỏ hàng
    const user = await User.findById(userId).populate("cart.courseId");

    // Lưu trữ thông tin mã giảm giá hợp lệ
    let validCoupon = null;

    // Kiểm tra từng khóa học trong giỏ hàng
    for (const item of user.cart) {
      const course = await Course.findById(item.courseId._id);
      if (course) {
        const discount = course.discounts.find(
          (discount) =>
            discount.code === couponCode && discount.expiresAt > new Date()
        );
        if (discount) {
          validCoupon = {
            code: discount.code,
            discountValue:
              discount.amount || course.price * (discount.percentage / 100), // Tính giá trị giảm giá
            courseId: course._id, // Khóa học mà mã giảm giá áp dụng
          };
          break; // Dừng lại khi tìm thấy mã giảm giá hợp lệ
        }
      }
    }

    if (!validCoupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    // Trả về thông tin mã giảm giá hợp lệ
    res
      .status(200)
      .json({ message: "Coupon applied successfully", coupon: validCoupon });
  } catch (error) {
    res.status(500).json({ message: "Error applying coupon", error });
  }
};

module.exports.removeCoupon = async (req, res) => {};
