import express from 'express';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST /api/orders — create new order
router.post('/', async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;

    if (!user || !products || products.length === 0 || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Assign unique IDs to each product
    const productsWithIds = products.map((product) => ({
      ...product,
      id: uuidv4(),
    }));

    const order = new Order({
      user,
      products: productsWithIds,
      totalAmount,
    });

    const savedOrder = await order.save();

    // Return only the new order's ID
    res
      .status(201)
      .json({ message: 'Order placed successfully', orderId: savedOrder._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
