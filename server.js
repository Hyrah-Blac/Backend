// ✅ Load .env early
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables explicitly from .env
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("📦 Loaded MONGODB_URI:", process.env.MONGODB_URI);
console.log("📦 Loaded PORT:", process.env.PORT);

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; // ✅ Import order routes

const app = express();
const PORT = process.env.PORT || 5000;

/* ================================
   ✅ CORS Configuration
================================ */
const allowedOrigins = [
  "https://shopstore-mdoo5f1sq-hyrahs-projects.vercel.app",
  "https://shopstore-sooty.vercel.app",
  "https://shopstore-git-main-hyrahs-projects.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/shopstore.*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error("❌ CORS blocked origin:", origin);
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],  // <-- PATCH added here
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ================================
   🚀 Middleware
================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

/* ================================
   🖼️ Static File Serving
================================ */
const assetsPath = path.join(__dirname, "public", "assets");
app.use("/assets", express.static(assetsPath));
console.log("🖼️ Serving static files from:", assetsPath);

/* ================================
   🚀 MongoDB Connection
================================ */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* ================================
   🚀 Routes
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes); // ✅ Add order routes

/* ================================
   ✅ Health Check Route
================================ */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* ================================
   🚀 Start Server
================================ */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
