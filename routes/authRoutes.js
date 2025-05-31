import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

/* ================================
   🧾 Signup Route
================================ */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }

    // Password hashing assumed in User schema pre-save middleware
    const newUser = new User({
      name,
      email: normalizedEmail,
      password,
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      role: newUser.role,
    });
  } catch (error) {
    console.error("🚨 Signup error:", error.message);
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

/* ================================
   📝 Login Route
================================ */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role || "user",
    });
  } catch (error) {
    console.error("🚨 Login error:", error.message);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

export default router;
