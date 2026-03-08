const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"NIT KKR Marketplace" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: text
  });
}

module.exports = sendEmail;