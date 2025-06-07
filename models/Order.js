import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4, // Auto-generate unique ID for each product in order
  },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
});

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: String,
  phone: String,
  address: String,
  lat: Number,
  lng: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: userSchema,
      required: true,
    },
    products: [productSchema],
    totalAmount: Number,
    status: {
      type: String,
      enum: ['Packaging', 'InTransit', 'Delivered'],
      default: 'Packaging',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
