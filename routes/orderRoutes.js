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

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/orders - get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/orders/:id/status - update order status
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Packaging", "InTransit", "Delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/orders/:id - delete order by ID (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
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
