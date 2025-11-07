const mongoose = require("mongoose");
const { nanoid } = require("nanoid"); // generate unique short IDs

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountNumber: { type: String, required: true },
  currency: { type: String, required: true },
  swiftCode: { type: String, required: true },
  amount: { type: Number, required: true },
  reference: { type: String, default: () => nanoid(10) },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);

