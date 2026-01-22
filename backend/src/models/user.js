import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password_hash: {
      type: String,
      required: true
    },

    phone: String,

    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },

    // Reference to latest measurement (NOT embedded)
    latest_measurement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Measurement"
    },

    // Reference to wishlist collection
    wishlist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist"
    },

    // ✅ NEW — multiple addresses stored as ObjectId references
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
