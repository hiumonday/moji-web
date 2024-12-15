const nodemailer = require("nodemailer");

module.exports.sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your Platform" <${process.env.SMTP_FROM}>`, // Sender address
    to: email, // Receiver email
    subject, // Subject line
    html, // Email content
  });
};
