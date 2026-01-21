import express from "express";
import {
  createShoe,
  getAllShoes,
  getShoeById,
  updateShoe,
  deleteShoe
} from "../controllers/ShoeController.js";

const router = express.Router();

// CRUD routes for shoes
router.post("/", createShoe);
router.get("/", getAllShoes);
router.get("/:id", getShoeById);
router.put("/:id", updateShoe);
router.delete("/:id", deleteShoe);

export default router;
