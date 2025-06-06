import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, default: "Unnamed Product" },
  image: { type: String, default: "/placeholder.png" },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: userSchema, required: true },
    products: { type: [productSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Packaging", "In Transit", "Delivered"],
      default: "Packaging",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
