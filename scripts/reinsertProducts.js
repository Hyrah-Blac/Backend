import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dressin";

await mongoose.connect(MONGODB_URI, {});

console.log("✅ MongoDB connected successfully.");

// Resolve image directory correctly
const imagesDir = path.join(__dirname, "..", "public", "assets");

// Product list with real image filenames from your system
const products = [
  {
    name: "Classic Graphic Tee",
    description: "High-quality graphic tee with stylish design.",
    imageUrl: "1746980196891-913015f6-5877-4f56-bf2d-826fd804b083.png",
    price: 1500,
  },
  {
    name: "Vintage Streetwear Shirt",
    description: "Trendy vintage shirt for casual wear.",
    imageUrl: "1746980206646-913015f6-5877-4f56-bf2d-826fd804b083.png",
    price: 1800,
  },
  {
    name: "Summer Vibe Tee",
    description: "Light and comfortable for summer days.",
    imageUrl: "1747050225578-WhatsApp Image 2025-05-12 at 14.36.55_280d76db.jpg",
    price: 1200,
  },
  {
    name: "Urban Oversized Shirt",
    description: "Perfect for street style lovers.",
    imageUrl: "1747050385709-WhatsApp Image 2025-05-12 at 14.36.55_b178177e.jpg",
    price: 1700,
  },
  {
    name: "Floral Print Dress",
    description: "Elegant floral dress for special occasions.",
    imageUrl: "1747050517948-WhatsApp Image 2025-05-12 at 14.36.56_db717854.jpg",
    price: 2200,
  },
  {
    name: "Casual White Tee",
    description: "Simple and classic white t-shirt.",
    imageUrl: "1747050673179-WhatsApp Image 2025-05-12 at 14.36.56_9b8f4f6f.jpg",
    price: 1000,
  },
  {
    name: "Denim Jacket",
    description: "Stylish denim jacket for any weather.",
    imageUrl: "1747050923941-WhatsApp Image 2025-05-09 at 02.09.44_407617ca.jpg",
    price: 2500,
  },
  {
    name: "Hooded Sweatshirt",
    description: "Comfortable hoodie for cold days.",
    imageUrl: "1747051114909-WhatsApp Image 2025-05-09 at 02.09.44_e219ea52.jpg",
    price: 2000,
  },
  {
    name: "Patterned Shirt",
    description: "Colorful patterned shirt for a bold look.",
    imageUrl: "1747051233976-WhatsApp Image 2025-05-09 at 02.09.44_1c894f27.jpg",
    price: 1600,
  },
  {
    name: "Plaid Overshirt",
    description: "Layer up with a stylish plaid overshirt.",
    imageUrl: "1747654414120-f4396159b1e9682b507f2504106ecac7.jpg",
    price: 2100,
  },
  {
    name: "Zip-Up Hoodie",
    description: "Classic zip-up hoodie for everyday wear.",
    imageUrl: "1747318810107-f4396159b1e9682b507f2504106ecac7.jpg",
    price: 2300,
  },
];

// Delete old data and insert new
const reinsertProducts = async () => {
  try {
    await Product.deleteMany({});
    console.log("✅ All products removed from database.");

    for (const product of products) {
      const imagePath = path.join(imagesDir, product.imageUrl);

      if (fs.existsSync(imagePath)) {
        const newProduct = new Product({
          name: product.name,
          description: product.description,
          imageUrl: `/assets/${product.imageUrl}`,
          price: product.price,
        });

        await newProduct.save();
        console.log(`✅ Added: ${product.name}`);
      } else {
        console.warn(`⚠️ Image not found: ${imagePath}`);
      }
    }

    console.log("🚀 Products reinserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error reinserting products:", error.message);
    process.exit(1);
  }
};

reinsertProducts();