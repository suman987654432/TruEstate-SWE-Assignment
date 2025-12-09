import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import saleRoutes from "./routes/saleRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sales", saleRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "TruEstate API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
