import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  shoeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shoe",
    required: true
  },
  quantity: Number,
  totalPrice: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Sale", saleSchema);