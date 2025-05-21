const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        fabric: { type: mongoose.Schema.Types.ObjectId, ref: "Fabric" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    tailoringService: {
      tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
      measurements: { type: String },
      price: { type: Number },
    },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], required: true },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },
    status: { type: String, enum: ["Processing", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
