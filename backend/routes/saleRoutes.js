import express from "express";
import { getSales, getSaleById, getSalesStats } from "../controllers/saleController.js";
const router = express.Router();
router.get("/", getSales);
router.get("/stats", getSalesStats);
router.get("/:id", getSaleById);
export default router;
