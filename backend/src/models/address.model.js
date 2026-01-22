import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    full_name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    address_line1: {
      type: String,
      required: true
    },

    address_line2: {
      type: String
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String
    },

    postal_code: {
      type: String,
      required: true
    },

    country: {
      type: String,
      required: true,
      default: "Pakistan" // change if needed
    },

    // mark default shipping address
    is_default: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", AddressSchema);
export default Address;
