const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Payment = require("../models/Payment");

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Submit payment
router.post("/", authenticate, async (req, res) => {
  try {
    const payment = new Payment({ ...req.body, user: req.userId });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
});

// Get all payments for logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

// 🧩 Get all payments (admin only)
router.get("/all", authenticate, async (req, res) => {
  try {
    // Optional: Only allow admins to access this
    // Example: if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

    // ✅ Fix: remove populate since name doesn't exist yet
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch all payments" });
  }
});

module.exports = router;
