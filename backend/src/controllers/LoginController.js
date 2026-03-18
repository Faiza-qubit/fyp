import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Your User model

// Helper to get JWT secret
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return secret;
}

// --------------------------- SIGNUP ---------------------------
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // ---------- NAME UNIQUENESS ----------
    const existingName = await User.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existingName) {
      return res.status(400).json({
        message: "Username already in use. Try a different one.",
      });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

     // ---------- PASSWORD STRENGTH ----------
    const strongPassword =
     /^(?=.*\d)(?=.*[@$!%*#?&^_-]).{6,}$/; // At least 6 chars, 1 number, 1 special char

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 6+ characters with at least 1 number and 1 special character",
      });
    }

    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(), // pre-save will hash it
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// --------------------------- LOGIN ---------------------------
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize email & trim password
    email = email.trim().toLowerCase();
    password = password.trim();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Debugging: log hashes (optional, remove in production)
    console.log("Login attempt:", { email, password, storedHash: user.password });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debugging
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    console.log("sent to frontend");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// --------------------------- GET CURRENT USER ---------------------------
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "No token provided" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(401).json({ success: false, message: "Invalid token", error: err.message });
  }
};

// --------------------------- FORGOT PASSWORD ---------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const strongPassword = /^(?=.*\d)(?=.*[@$!%*#?&^_-]).{6,}$/;
    if (!strongPassword.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be 6+ characters with at least 1 number and 1 special character",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }

    user.password = newPassword.trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully. Please login.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// --------------------------- UPDATE FOOT PROFILE ---------------------------
export const updateFootProfile = async (req, res) => {
  try {
    const { footLengthCm, footWidthCm, euSize, usSize } = req.body;

    // ⭐ CORRECT USER ID
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.footProfile = {
      footLengthCm,
      footWidthCm,
      euSize,
      usSize,
    };

    await user.save();

    res.json({
      success: true,
      message: "Foot profile updated successfully",
      footProfile: user.footProfile,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};