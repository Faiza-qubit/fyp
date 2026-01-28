import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByEmail,
} from "../controllers/PaymentController.js";

const router = express.Router();

// Payment routes
router.post("/create-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.get("/email/:email", getPaymentsByEmail);

export default router;
