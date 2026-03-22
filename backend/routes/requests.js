const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const jwt = require("jsonwebtoken");

// 🔐 AUTH MIDDLEWARE
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


// ➕ CREATE REQUEST
router.post("/", auth, async (req, res) => {

  try {

    const { title, description, budget } = req.body;

    // ✅ Validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const request = new Request({
      title,
      description,
      budget,
      requester: req.userId,
      status: "open" // 🔥 ensure default
    });

    await request.save();

    res.json(request);

  } catch (err) {

    console.error("Create request error:", err);
    res.status(500).json({ message: "Server error" });

  }

});


// 📦 GET ALL REQUESTS (ONLY OPEN)
router.get("/", async (req, res) => {

  try {

    const requests = await Request.find({ status: "open" })
      .populate("requester", "name mobile");

    res.json(requests);

  } catch (err) {

    console.error("Fetch requests error:", err);
    res.status(500).json({ message: "Server error" });

  }

});


// 📋 MY REQUESTS (OPTIONAL: include all statuses)
router.get("/mine", auth, async (req, res) => {

  try {

    const requests = await Request.find({ requester: req.userId });

    res.json(requests);

  } catch (err) {

    console.error("Fetch my requests error:", err);
    res.status(500).json({ message: "Server error" });

  }

});


// ✅ MARK FULFILLED
router.patch("/:id/fulfilled", auth, async (req, res) => {

  try {

    const reqItem = await Request.findById(req.params.id);

    if (!reqItem) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (reqItem.requester.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    reqItem.status = "fulfilled";
    await reqItem.save();

    res.json({ message: "Marked fulfilled" });

  } catch (err) {

    console.error("Fulfill request error:", err);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;