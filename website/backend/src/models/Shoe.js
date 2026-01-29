import mongoose from "mongoose";

const shoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  brand: {
    type: String,
    required: true,
    enum: ["Nike", "Adidas", "Puma", "Clarks", "Gucci", "Jordan", "New Balance"],
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
    enum: ["Running", "Casual", "Formal", "Sneakers"],
  },

  gender: {
    type: String,
    required: true,
    enum: ["Men", "Women", "Unisex"],
  },

  color: {
    type: String,
    required: true,
    enum: ["Black", "White", "Red", "Blue", "Green", "Gold", "Gray"],
  },

  description: {
    type: String,
    default: "",
  },

  sizes: {
    type: [String], // ["8", "9", "10"]
    default: ["8", "9", "10", "11", "12"],
  },

  stock: {
    type: Number,
    default: 50,
  },

  image: {
    type: String,
    default: "https://via.placeholder.com/400",
  },

  arEnabled: {
    type: Boolean,
    default: false,
  },

  rating: {
    type: Number,
    default: 4.8,
  },

  reviews: {
    type: Number,
    default: 128,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Shoe", shoeSchema);
