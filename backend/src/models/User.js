import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,          // username uniqueness
      lowercase: true,       // store in lowercase
      trim: true             // remove extra spaces
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6           // basic password rule
    },

    footProfile: {
      footLengthCm: { type: String, default: "" },
      footWidthCm: { type: String, default: "" },
      recommendedSize: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Password hashing
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", UserSchema);
export default User;