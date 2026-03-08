const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mailer");
const User = require("../models/User");


// Auth middleware
function auth(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}


// CREATE ITEM
router.post("/", auth, async (req, res) => {

  const { title, category, price, description } = req.body;

  const item = new Item({
    title,
    category,
    price,
    description,
    seller: req.userId
  });

  await item.save();
  const user = await User.findById(req.userId);

await sendEmail(
  user.email,
  "Item Listed Successfully",
  `Your item "${item.title}" has been listed successfully on the NIT KKR Marketplace.

Price: ₹${item.price}

Please remember to mark the item as SOLD once it is no longer available.`
);

  res.json(item);

});


// GET ALL ITEMS
router.get("/", async (req, res) => {

  const items = await Item.find({ status: "available" })
    .populate("seller", "name email mobile");

  res.json(items);

});


// MY LISTINGS
router.get("/mine", auth, async (req, res) => {

  const items = await Item.find({ seller: req.userId });

  res.json(items);

});


// MARK SOLD
router.patch("/:id/sold", auth, async (req, res) => {

  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (item.seller.toString() !== req.userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  item.status = "sold";

  await item.save();

  const user = await User.findById(req.userId);

  await sendEmail(
    user.email,
    "Item Marked as SOLD",
    `Your item "${item.title}" has been marked as SOLD on the NIT KKR Marketplace.

Thank you for using the marketplace.`
  );

  res.json({ message: "Item marked sold" });

});

module.exports = router;