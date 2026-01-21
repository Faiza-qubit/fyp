import express from "express";
import { signup, login, getCurrentUser } from "../controllers/LoginController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/signup
router.post("/signup", signup);

// POST /api/login
router.post("/login", login);

// GET /api/me -> protected route
router.get("/me", protect, getCurrentUser);

export default router;
