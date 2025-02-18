const DiscountCode = require("../models/DiscountCode");

module.exports.checkAlumniCode = async (req, res) => {
  console.log("Received alumni code verification request:", {
    body: req.body,
    headers: {
      contentType: req.headers["content-type"],
      authorization: req.headers.authorization
        ? "Bearer token exists"
        : "No bearer token",
    },
    user: req.user ? { id: req.user._id } : "No user",
  });

  const { couponCode } = req.body;

  if (!couponCode) {
    console.log("No coupon code provided in request");
    return res.status(400).json({
      success: false,
      message: "Please provide a coupon code",
    });
  }

  try {
    console.log("Searching for alumni discount with criteria:", {
      discount_code: couponCode.trim(),
      discount_type: "alumni",
      isActive: true,
      usage_count: { $gt: 0 },
      expiresAt: { $gt: new Date() },
    });

    const alumniDiscount = await DiscountCode.findOne({
      discount_code: couponCode.trim(),
      discount_type: "alumni",
      isActive: true,
      usage_count: { $gt: 0 },
      expiresAt: { $gt: new Date() },
    });

    console.log(
      "Database query result:",
      alumniDiscount
        ? {
            found: true,
            id: alumniDiscount._id,
            code: alumniDiscount.discount_code,
            type: alumniDiscount.discount_type,
            isActive: alumniDiscount.isActive,
            usage_count: alumniDiscount.usage_count,
            expiresAt: alumniDiscount.expiresAt,
          }
        : "No discount found"
    );

    if (!alumniDiscount) {
      // Try to find the code without restrictions to understand why it failed
      const existingCode = await DiscountCode.findOne({
        discount_code: couponCode.trim(),
      });

      console.log(
        "Verification failed. Existing code details:",
        existingCode
          ? {
              id: existingCode._id,
              type: existingCode.discount_type,
              isActive: existingCode.isActive,
              usage_count: existingCode.usage_count,
              expiresAt: existingCode.expiresAt,
              isExpired: existingCode.expiresAt < new Date(),
            }
          : "Code does not exist at all"
      );

      return res.status(400).json({
        success: false,
        message: "Invalid or expired alumni code",
        debug: existingCode
          ? {
              isWrongType: existingCode.discount_type !== "alumni",
              isInactive: !existingCode.isActive,
              isUsed: existingCode.usage_count <= 0,
              isExpired: existingCode.expiresAt < new Date(),
            }
          : { reason: "code_not_found" },
      });
    }

    // Decrease usage count
    console.log("Updating usage count for discount:", {
      id: alumniDiscount._id,
      oldCount: alumniDiscount.usage_count,
      newCount: 0,
    });

    alumniDiscount.usage_count = 0;
    await alumniDiscount.save();

    console.log("Alumni code verification successful");

    res.status(200).json({
      success: true,
      message: "Valid alumni code",
      discount: {
        code: alumniDiscount.discount_code,
        type: "alumni",
      },
    });
  } catch (error) {
    console.error("Error in alumni code verification:", {
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Error checking alumni code",
      debug: {
        error: error.message,
      },
    });
  }
};
