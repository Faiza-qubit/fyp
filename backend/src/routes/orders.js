import express from "express";
import auth from "../middleware/auth.js";
import { placeOrder, getOrderHistory } from "../controllers/orderController.js";

const router = express.Router();

// all routes require authentication
router.use(auth);

router.post("/place", placeOrder);
router.get("/history", getOrderHistory);

export default router;
