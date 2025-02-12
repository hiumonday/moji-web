const User = require("../models/User");
const Course = require("../models/Course");

module.exports.viewCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate("cart.courseId");
    console.log(user);
    const cartItems = user.cart.map((item) => {
      let imageBase64 = null;
      if (item.courseId.image && item.courseId.image.data) {
        imageBase64 = `data:${
          item.courseId.image.contentType
        };base64,${item.courseId.image.data.toString("base64")}`;
      }
      const classInfo = item.courseId.classes.id(item.classId);
      let discount_type = "";
      let earlyBirdSlot = classInfo.earlyBirdSlot;

      const participantsWithPrice = item.participants.map((participant) => {
        let price = item.courseId.price;
        if (participant.isAlumni) {
          price = item.courseId.alumniPrice;
          discount_type = "Alumni";
        } else if (earlyBirdSlot > 0) {
          price = item.courseId.earlyBirdPrice;
          discount_type = "Early Bird";
          earlyBirdSlot--;
        } else if (item.participants.length > 1) {
          price = item.courseId.bundlePrice;
          discount_type = "Bundle";
        }
        console.log(discount_type);
        console.log(participant);
        return {
          info: participant,
          price,
          discount_type,
        };
      });

      return {
        _id: item.courseId._id,
        title: item.courseId.title,
        description: item.courseId.description,
        price: item.courseId.price,
        classInfo: {
          level: classInfo.level,
          language: classInfo.language,
          teacherName: classInfo.teacherName,
          day: classInfo.day,
          startTime: classInfo.startTime,
          endTime: classInfo.endTime,
          classId: classInfo._id,
          earlyBirdSlot: classInfo.earlyBirdSlot,
        },
        image: imageBase64,
        participants: participantsWithPrice,
      };
    });

    const originalTotal = cartItems.reduce((sum, item) => {
      const numParticipants = item.participants.length;
      let price = item.price;

      return sum + price * numParticipants;
    }, 0);

    const totalPrice = cartItems.reduce((sum, item) => {
      return (
        sum +
        item.participants.reduce((participantSum, participant) => {
          return participantSum + participant.price;
        }, 0)
      );
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

  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      return User.findById(userId);
    })
    .then((user) => {
      const existingItem = user.cart.find(
        (item) =>
          item.courseId.toString() === courseId &&
          item.classId.toString() === classId
      );

      if (existingItem) {
        existingItem.participants.push(...participants);
      } else {
        user.cart.push({ courseId, classId, participants });
      }

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
  const { courseId, classId } = req.params;
  console.log(courseId, classId);

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
          cart: { courseId: courseId, classId: classId }, // Xóa phần tử có courseId và classId tương ứng
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

  console.log(req.user);

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
