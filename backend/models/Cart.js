const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        fabric: { type: mongoose.Schema.Types.ObjectId, ref: "Fabric", required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    tailoringService: {
      tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor" },
      measurements: { type: String }, // Customer-provided measurements
      price: { type: Number },
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
