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

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(401).json({ success: false, message: "Invalid token", error: err.message });
  }
};
