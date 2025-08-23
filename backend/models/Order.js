import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
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
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  }
});

const shippingDetailsSchema = new mongoose.Schema({
  carrier: {
    type: String,
    enum: ['Blue Dart', 'DTDC', 'India Post', 'FedEx', 'DHL'],
    default: 'Blue Dart'
  },
  method: {
    type: String,
    enum: ['Standard Delivery', 'Express Delivery', 'Same Day Delivery'],
    default: 'Standard Delivery'
  },
  cost: {
    type: Number,
    default: 0
  },
  trackingUrl: String
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'],
    default: 'COD'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  deliveryDate: Date,
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  shippingDetails: shippingDetailsSchema,
  notes: String,
  cancelReason: String,
  refundAmount: Number,
  refundDate: Date
}, {
  timestamps: true
});

// Generate tracking number before saving
orderSchema.pre('save', function(next) {
  if (!this.trackingNumber && this.status === 'Shipped') {
    this.trackingNumber = 'TL' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Calculate estimated delivery date
orderSchema.pre('save', function(next) {
  if (!this.estimatedDelivery) {
    const deliveryDays = this.shippingDetails?.method === 'Express Delivery' ? 2 : 
                        this.shippingDetails?.method === 'Same Day Delivery' ? 0 : 5;
    this.estimatedDelivery = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.model('Order', orderSchema);
