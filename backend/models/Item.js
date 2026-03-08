const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  category: String,

  price: Number,

  description: String,

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available"
  }

}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);