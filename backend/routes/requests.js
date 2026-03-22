const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const jwt = require("jsonwebtoken");

// 🔐 AUTH MIDDLEWARE
function auth(req, res, next) {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

}


// ➕ CREATE REQUEST
router.post("/", auth, async (req, res) => {

  const { title, description, budget } = req.body;

  const request = new Request({
    title,
    description,
    budget,
    requester: req.userId
  });

  await request.save();

  res.json(request);

});


// 📦 GET ALL REQUESTS
router.get("/", async (req, res) => {

  const requests = await Request.find({ status: "open" })
    .populate("requester", "name email mobile");

  res.json(requests);

});


// 📋 MY REQUESTS
router.get("/mine", auth, async (req, res) => {

  const requests = await Request.find({ requester: req.userId });

  res.json(requests);

});


// ✅ MARK FULFILLED
router.patch("/:id/fulfilled", auth, async (req, res) => {

  const reqItem = await Request.findById(req.params.id);

  if (!reqItem) return res.status(404).json({ message: "Not found" });

  if (reqItem.requester.toString() !== req.userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  reqItem.status = "fulfilled";
  await reqItem.save();

  res.json({ message: "Marked fulfilled" });

});

module.exports = router;