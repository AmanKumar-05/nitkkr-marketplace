const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, text) {
  await resend.emails.send({
    from: "NIT KKR Marketplace <onboarding@resend.dev>",
    to: to,
    subject: subject,
    text: text
  });
}

module.exports = sendEmail;