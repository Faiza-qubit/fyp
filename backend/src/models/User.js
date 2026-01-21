import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Pre-save hook for hashing password
UserSchema.pre("save", async function () {
  // `this` refers to the current document
  if (!this.isModified("password")) return; // only hash if password changed
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", UserSchema);
export default User;
