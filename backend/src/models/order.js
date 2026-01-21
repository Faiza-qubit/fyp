import mongoose from "mongoose";
import orderItemSchema from "./orderItem.model.js";
import shippingSchema from "./shipping.model.js";
import paymentSchema from "./payment.model.js";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    orderItems: [orderItemSchema],
    shippingAddress: shippingSchema,
    payment: paymentSchema,

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    totalPrice: { type: Number, required: true },
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },

    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date,

    isReturned: { type: Boolean, default: false },
    returnReason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
