import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;

    if (
      !user ||
      !user._id || // Make sure user._id is sent
      !products ||
      products.length === 0 ||
      !totalAmount
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Assign unique ids to products (if they don't have one)
    const productsWithIds = products.map((product) => ({
      id: product.id || uuidv4(),
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: product.quantity,
    }));

    // Convert user._id string to mongoose ObjectId
    const userWithObjectId = {
      ...user,
      _id: new mongoose.Types.ObjectId(user._id),
    };

    const order = new Order({
      user: userWithObjectId,
      products: productsWithIds,
      totalAmount,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userOrders = await Order.find({
      'user._id': new mongoose.Types.ObjectId(userId),
    });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Fetch user orders error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update delivery status
router.put('/:id/status', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Status updated', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
