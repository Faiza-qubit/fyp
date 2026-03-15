import express from "express";
import {
	signup,
	login,
	getCurrentUser,
	forgotPassword,
	updateFootProfile,
} from "../controllers/LoginController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/signup
router.post("/signup", signup);

// POST /api/login
router.post("/login", login);

// POST /api/forgot-password
router.post("/forgot-password", forgotPassword);

// GET /api/me -> protected route
router.get("/me", protect, getCurrentUser);

// PUT /api/profile/foot-size -> protected route
router.put("/profile/foot-size", protect, updateFootProfile);

export default router;
