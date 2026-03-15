import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByEmail,
  getMyPayments,
} from "../controllers/PaymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Payment routes
router.post("/create-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/", getAllPayments);
router.get("/my-orders", protect, getMyPayments);
router.get("/email/:email", getPaymentsByEmail);
router.get("/:id", getPaymentById);

export default router;
