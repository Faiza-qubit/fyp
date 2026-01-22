import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["Stripe", "PayPal", "COD"],
    required: true
  },
  status: {
    type: String,
    enum: ["paid", "unpaid", "failed"],
    default: "unpaid"
  }
});

export default paymentSchema;
