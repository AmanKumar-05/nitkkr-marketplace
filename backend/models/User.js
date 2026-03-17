const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: String,
    enum: ["student", "staff"],
    required: true
  },

  hostel: {
    type: String
  },

  mobile: {
    type: String
  },

  otp: {
    type: String
  },

  otpExpiry: {
    type: Date
  },

  verified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);