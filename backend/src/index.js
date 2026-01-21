import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env FIRST, before importing other modules
dotenv.config({ path: join(__dirname, '.env') });

// Import routes AFTER dotenv is configured
import paymentRoutes from "./routes/PaymentRoutes.js";
import shoeRoutes from "./routes/ShoeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // increase limit for large images
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/shoes", shoeRoutes);
app.use("/api/payments", paymentRoutes);

// Connect MongoDB
mongoose.connect("mongodb+srv://gullfaiza22_db_user:wtfwtfwtf0@cluster0.dsbp0z9.mongodb.net/?appName=Cluster0")
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
