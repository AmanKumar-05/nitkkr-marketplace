const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// Middleware to check JWT token
function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


// GET PROFILE
router.get("/me", authMiddleware, async (req, res) => {

  const user = await User.findById(req.userId).select("-otp -otpExpiry");

  res.json(user);

});


// UPDATE PROFILE
router.put("/me", authMiddleware, async (req, res) => {

  const { hostel, mobile } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { hostel, mobile },
    { new: true }
  );

  res.json(user);

});

module.exports = router;