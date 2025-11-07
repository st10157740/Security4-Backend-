const { body, validationResult } = require("express-validator");

// Simple regex patterns (adjust later for production)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^.{6,}$/; // at least 6 chars

// Validation for /login (existing)
const validateLogin = [
  body("email")
    .matches(emailPattern)
    .withMessage("Invalid email format"),
  body("password")
    .matches(passwordPattern)
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for /create-employee (existing)
const validateCreateEmployee = [
  body("email")
    .matches(emailPattern)
    .withMessage("Invalid email format"),
  body("password")
    .matches(passwordPattern)
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["admin", "employee"])
    .withMessage("Role must be 'admin' or 'employee'"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ----------------- New: validateRegister -----------------
const validateRegister = [
  body("email")
    .matches(emailPattern)
    .withMessage("Invalid email format"),
  body("password")
    .matches(passwordPattern)
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateLogin, validateCreateEmployee, validateRegister };
