const express = require("express");
const { loginEmployee, addEmployee } = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Login route (any employee can log in)
router.post("/login", loginEmployee);

// 🔹 Add employee route (only admins can add)
router.post("/add", protect, addEmployee);

module.exports = router;
