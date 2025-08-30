import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: 'India'
  },
  phone: {
    type: String,
    required: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const customerSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  addresses: [addressSchema],
  preferences: {
    fabricTypes: [{
      type: String
    }],
    priceRange: {
      min: Number,
      max: Number
    },
    favoriteColors: [{
      type: String
    }]
  },
  favoriteShops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  }],
  favoriteTailors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tailor'
  }],
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
customerSchema.index({ 
  name: 'text', 
  email: 'text', 
  city: 'text' 
});

// Index for filtering
customerSchema.index({ city: 1, isActive: 1 });

export default mongoose.model('Customer', customerSchema);
