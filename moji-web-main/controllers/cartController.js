const User = require("../models/User");
const Course = require("../models/Course");
const DiscountCode = require("../models/DiscountCode");

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

    const totalBeforeDiscount = cartItems.reduce((sum, item) => {
      return (
        sum +
        item.participants.reduce((participantSum, participant) => {
          return participantSum + participant.price;
        }, 0)
      );
    }, 0);

    // Check if coupon is still valid
    let finalTotal = totalBeforeDiscount;
    let discountPercentage = 0;

    if (user.appliedDiscount && user.appliedDiscount.expiryDate > new Date()) {
      discountPercentage = user.appliedDiscount.percentage;
      const discountAmount = (totalBeforeDiscount * discountPercentage) / 100;
      finalTotal = totalBeforeDiscount - discountAmount;
    } else if (user.appliedDiscount) {
      // Remove expired discount
      await User.findByIdAndUpdate(userId, {
        $unset: { appliedDiscount: "" },
      });
    }

    let discountAmount =
      originalTotal > 0
        ? ((originalTotal - finalTotal) / originalTotal) * 100
        : 0;

    res.status(200).json({
      cart: cartItems,
      totalPrice: finalTotal,
      originalTotal: originalTotal,
      discount: discountAmount,
    });
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

module.exports.verifyCoupon = async (req, res) => {
  const userId = req.user._id;
  const { couponCode } = req.body;

  try {
    const discountCode = await DiscountCode.findOne({
      discount_code: couponCode,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!discountCode) {
      return res
        .status(400)
        .json({ message: "Invalid or expired coupon code" });
    }

    await User.findByIdAndUpdate(userId, {
      appliedDiscount: {
        percentage: discountCode.percentage,
        couponCode: discountCode.discount_code,
        expiryDate: discountCode.expiresAt,
      },
    });

    res.status(200).json({
      success: true,
      coupon: {
        code: discountCode.discount_code,
        percentage: discountCode.percentage,
        expiryDate: discountCode.expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying coupon", error });
  }
};

module.exports.removeCoupon = async (req, res) => {
  const userId = req.user._id;

  try {
    await User.findByIdAndUpdate(userId, {
      $unset: { appliedDiscount: "" },
    });

    res.status(200).json({ message: "Coupon removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing coupon", error });
  }
};
