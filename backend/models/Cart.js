import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  fabric: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fabric',
    required: true
  },
  fabricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fabric',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  this.lastUpdated = new Date();
  next();
});

// Update subtotal for each item
cartItemSchema.pre('save', function(next) {
  this.subtotal = this.price * this.quantity;
  next();
});

export default mongoose.model('Cart', cartSchema);
