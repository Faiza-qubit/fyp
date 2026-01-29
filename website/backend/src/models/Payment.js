import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  // Billing Information
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  zipCode: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },

  // Payment Information (Stripe handles card securely)
  cardName: {
    type: String,
    default: "",
  },
  cardNumber: {
    type: String,
    default: "****-****-****-****",
  },
  expiryDate: {
    type: String,
    default: "****",
  },
  cvv: {
    type: String,
    default: "***",
  },

  // Order Details
  shoeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shoe",
  },
  shoeSize: {
    type: String,
    default: "",
  },
  shoeColor: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    required: true,
  },

  // Payment Status
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },

  stripePaymentIntentId: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payment", paymentSchema);
