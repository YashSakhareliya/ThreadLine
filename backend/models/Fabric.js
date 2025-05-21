const mongoose = require("mongoose");

const fabricSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the seller
    imageUrl: { type: String }, // For storing fabric images (e.g., Cloudinary URL)
    category: { type: String }, // e.g., "Cotton", "Silk", "Denim"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fabric", fabricSchema);
