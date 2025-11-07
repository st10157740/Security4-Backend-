const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ----- MFA fields -----
  mfaEnabled: { type: Boolean, default: false },    // whether MFA is activated
  mfaSecret: { type: String, default: null },       // TOTP secret for authenticator app
  mfaTempSecret: { type: String, default: null },   // temporary secret during setup
  mfaRecoveryCodes: { type: [String], default: [] } // optional backup codes
});

module.exports = mongoose.model('User', userSchema);
