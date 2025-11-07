const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Payment = require("../models/Payment");

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Invalid token" });
  }
};

// Protected dashboard route
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -refreshToken -mfaSecret");
    if (!user) return res.status(404).json({ message: "User not found" });

    const payments = await Payment.find({ user: req.userId }).sort({ createdAt: -1 });

    res.json({ user, payments });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit a payment
router.post("/payment", authenticate, async (req, res) => {
  try {
    const { accountNumber, currency, swiftCode, amount } = req.body;
    if (!accountNumber || !currency || !swiftCode || !amount) {
      return res.status(400).json({ message: "All payment fields are required" });
    }

    if (isNaN(amount)) return res.status(400).json({ message: "Amount must be a number" });

    const payment = new Payment({
      user: req.userId,
      accountNumber,
      currency,
      swiftCode,
      amount,
    });

    await payment.save();
    res.status(201).json({ message: "Payment request submitted", payment });
  } catch (err) {
    console.error("Payment submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Optional: Fetch payment history separately
router.get("/payments", authenticate, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
