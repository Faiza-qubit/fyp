import express from "express";
import { createFeedback, getAllFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// POST /api/feedback - submit feedback
router.post("/", createFeedback);

// GET /api/feedback - get all feedbacks (admin)
router.get("/", getAllFeedback);

export default router;
