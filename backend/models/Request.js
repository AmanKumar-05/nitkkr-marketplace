const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: String,

  budget: Number,

  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["open", "fulfilled"],
    default: "open"
  }

}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);