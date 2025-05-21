const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to seller's user profile
    shopName: { type: String, required: true },
    shopAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },
    shopContact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
