const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

module.exports = sendEmail;
