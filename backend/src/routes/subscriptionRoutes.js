import express from "express";
import { subscribe, checkSubscription } from "../controllers/subscriptionController.js";
const router = express.Router();

router.get("/check", checkSubscription);
router.post("/", subscribe);

export default router;
