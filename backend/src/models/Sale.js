import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },

  items: [
    {
      shoeId: { type: String, required: true },
      quantity: Number,
      totalPrice: Number,
    },
  ],

  totalAmount: Number,

  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Sale", saleSchema);