import express from "express";
import Order from "../models/Order.js";

const router = express.Router();


// POST /api/orders - create new order
router.post("/", async (req, res) => {
  try {
    const { user, products, totalAmount, status } = req.body;
    if (!user || !products || products.length === 0 || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = new Order({
      user,
      products,
      totalAmount,
      status: status || "Packaging",
    });

    const savedOrder = await order.save();

    // ✅ Return just the order ID to frontend
    res.status(201).json({ message: "Order placed successfully", orderId: savedOrder._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: GET /api/orders/user/:phone - get orders by user phone
router.get("/user/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const orders = await Order.find({ "user.phone": phone }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
