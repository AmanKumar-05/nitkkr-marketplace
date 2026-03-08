const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mailer");


// ------------------ SEND OTP ------------------

router.post("/send-otp", async (req, res) => {
  try {
    const { name, email, role, roll, hostel, mobile } = req.body;

    if (!email.endsWith("@nitkkr.ac.in")) {
      return res.status(400).json({ message: "Only NIT KKR emails allowed" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        role,
        roll,
        hostel,
        mobile
      });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    console.log("Generating OTP for:", email);
    console.log("OTP:", otp);

    try {
      await sendEmail(
        email,
        "NIT KKR Marketplace OTP",
        `Your OTP for login is: ${otp}. It will expire in 2 minutes.`
      );

      console.log("OTP email sent successfully");

    } catch (mailError) {
      console.error("Email sending failed:", mailError);
      return res.status(500).json({
        message: "OTP generated but email could not be sent"
      });
    }

    res.json({
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ error: error.message });
  }
});
// ------------------ VERIFY OTP ------------------

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.verified = true;
    user.otp = null;

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;