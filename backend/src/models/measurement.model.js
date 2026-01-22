import mongoose from "mongoose";

const MeasurementSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    left: {
      length_mm: Number,
      width_mm: Number,
      arch_height_mm: Number
    },

    right: {
      length_mm: Number,
      width_mm: Number,
      arch_height_mm: Number
    },

    scanned_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Measurement = mongoose.model("Measurement", MeasurementSchema);
export default Measurement;
