import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  country: { type: String, default: "" },
  cardName: { type: String, default: "" },
  cardNumber: { type: String, default: "****-****-****-****" },
  expiryDate: { type: String, default: "****" },
  cvv: { type: String, default: "***" },

  // ✅ MULTIPLE ITEMS (THIS FIXES EVERYTHING)
  items: {
    type: [
      {
        shoeId: {
          type: String, // ✅ IMPORTANT (mock id)
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: String,
          default: "",
        },
        color: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          default: 0,
        },
      },
    ],
    default: [],
  },

  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },

  stripePaymentIntentId: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);