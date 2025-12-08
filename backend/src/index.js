import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import shoeRoutes from "./routes/ShoeRoutes.js";

dotenv.config(); // load .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // increase limit for large images
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/shoes", shoeRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
