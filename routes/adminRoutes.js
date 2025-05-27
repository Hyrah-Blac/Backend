import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Add product (requires admin auth)
router.post("/add-product", adminMiddleware, (req, res) => {
  const { name, description, price, image } = req.body;

  if (!name || !description || !price || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  res.status(200).json({ message: "Product added successfully" });
});

export default router;