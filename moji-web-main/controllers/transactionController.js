const User = require("../models/User");
const Course = require("../models/Course");
const sendEmail = require("../utils/sendEmails"); // Your email utility

exports.transactionWebhook = async (req, res) => {
  try {
    const { userId, transactionStatus, courseIds } = req.body;

    // Check if the transaction was successful
    if (transactionStatus !== "success") {
      return res.status(400).json({
        success: false,
        message: "Transaction failed or not completed.",
      });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Fetch course details
    const courses = await Course.find({ _id: { $in: courseIds } });
    if (!courses.length) {
      return res
        .status(404)
        .json({ success: false, message: "Courses not found." });
    }

    // Prepare course details for email
    const courseDetails = courses
      .map(
        (course) =>
          `<li><strong>${course.title}</strong>: $${course.price.toFixed(
            2
          )}</li>`
      )
      .join("");

    // Email content
    const emailContent = `
      <h1>Payment Confirmation</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for your purchase! Below are the details of the courses you have purchased:</p>
      <ul>${courseDetails}</ul>
      <p>You can now access your courses by logging into your account.</p>
      <p>Happy Learning!</p>
    `;

    // Send email to the user
    await sendEmail({
      email: user.email,
      subject: "Your Course Purchase Details",
      html: emailContent,
    });

    res.status(200).json({
      success: true,
      message: "Transaction processed successfully. Email sent to user.",
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
