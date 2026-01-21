import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env FIRST
dotenv.config({ path: join(__dirname, ".env") });

// Import routes AFTER dotenv is configured
import paymentRoutes from "./routes/PaymentRoutes.js";
import shoeRoutes from "./routes/ShoeRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ Import auth routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/shoes", shoeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api", authRoutes); // ✅ Add auth routes

// Optional: Test route to verify token
// import { protect } from "./middleware/authMiddleware.js";
// app.get("/api/protected", protect, (req, res) => {
//   res.json({ message: `Hello ${req.user.email}, you are authorized!` });
// });

// Connect MongoDB
mongoose
  .connect(
    "mongodb+srv://gullfaiza22_db_user:wtfwtfwtf0@cluster0.dsbp0z9.mongodb.net/?appName=Cluster0"
  )
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Full error:", err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
