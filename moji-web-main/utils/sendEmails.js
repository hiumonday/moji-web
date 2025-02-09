const nodemailer = require("nodemailer");

module.exports.sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your Platform" <${SMTP_FROM}>`, // Sender address
    to: email, // Receiver email
    subject, // Subject line
    html, // Email content
  });
};
