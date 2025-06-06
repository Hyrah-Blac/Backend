import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  lat: Number,
  lng: Number,
});

const orderSchema = new mongoose.Schema({
  user: userSchema,
  products: [productSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Packaging", "InTransit", "Delivered"],
    default: "Packaging",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
