const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const securityMiddleware = require('./middleware/security');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer'); // ✅ customer routes
const paymentRoutes = require("./routes/payments");

// ✅ NEW: Import employee routes
const employeeRoutes = require("./routes/employeeRoutes");

// ✅ NEW: Import CORS
const cors = require("cors");

const app = express();

// ✅ NEW: Apply CORS for frontend (adjust origin if needed)
app.use(cors({
  origin: "https://localhost:5173",  // your React frontend URL
  credentials: true
}));

// Apply security & CORS middleware (includes express.json)
securityMiddleware(app);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ NEW: Add employee routes
app.use("/api/employees", employeeRoutes);

// Port
const PORT = process.env.PORT || 5000;

// HTTPS setup
const sslKeyPath = path.join(__dirname, 'ssl', 'localhost-key.pem');
const sslCertPath = path.join(__dirname, 'ssl', 'localhost.pem');

if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
  const options = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`✅ HTTPS Server running on https://localhost:${PORT}`);
  });
} else {
  // Fallback to HTTP
  app.listen(PORT, () => {
    console.log(`⚠️  HTTPS certificates not found. HTTP server running on http://localhost:${PORT}`);
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});
