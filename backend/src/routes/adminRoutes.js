import express from "express";
import { stockPrediction } from "../controllers/predictionController.js";

const router = express.Router();

router.get("/stock-prediction", stockPrediction);

export default router;