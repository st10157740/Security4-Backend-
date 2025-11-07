const express = require('express');
const router = express.Router();

// Import controller
const authController = require('../controllers/authcontroller');

// Import validation middleware
const { validateLogin, validateCreateEmployee, validateRegister } = require('../middleware/validateInput');

// Import JWT protect middleware
const { protect } = require('../middleware/authMiddleware');

// -------------------- Routes --------------------

// Registration route: only validate email & password (frontend works)
router.post('/register', validateRegister, (req, res, next) => {
  authController.register(req, res).catch(next);
});

// Login endpoint
router.post('/login', validateLogin, (req, res, next) => {
  authController.login(req, res).catch(next);
});

// Refresh JWT token
router.post('/refresh', (req, res, next) => {
  authController.refreshToken(req, res).catch(next);
});

// Setup MFA (user must be logged in)
router.post('/setup-mfa', protect, (req, res, next) => {
  authController.setupMFA(req, res).catch(next);
});

// Verify MFA code
router.post('/verify-mfa', (req, res, next) => {
  authController.verifyMFA(req, res).catch(next);
});

// Logout
router.post('/logout', (req, res, next) => {
  authController.logout(req, res).catch(next);
});

module.exports = router;

//Code Attribution:
//Title:Node.js Security Best Practices: JWT blacklisting, rate limiting, schema validation
// Author:Software Developer Diaries
//Date:20 November 2023
//Availability:https://youtu.be/DYme1m4RiwI?si=Xb0mN09uPJev_4X6 