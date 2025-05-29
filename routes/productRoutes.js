import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "public", "assets");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* === POST: Add Product === */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: "Name, description, and price are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image upload failed." });
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) {
      return res.status(400).json({ message: "Price must be a valid number." });
    }

    const imageUrl = `/assets/${req.file.filename}`;

    const newProduct = new Product({
      name,
      description,
      price: priceNumber,
      imageUrl,
    });

    await newProduct.save();
    res.status(200).json({ message: "Product added successfully", product: newProduct });

  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

/* === GET: All Products === */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/* === GET: Single Product by ID === */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

/* === PUT: Update Product Price === */
router.put("/:id", async (req, res) => {
  try {
    const { price } = req.body;

    const priceNumber = parseFloat(price);
    if (!price || isNaN(priceNumber)) {
      return res.status(400).json({ message: "Price must be a valid number." });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { price: priceNumber },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product price updated", product: updated });

  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Failed to update product price" });
  }
});

/* === DELETE: Remove Product by ID === */
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image file
    const imagePath = path.resolve(__dirname, "..", "public", product.imageUrl.replace(/^\/+/, ""));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
