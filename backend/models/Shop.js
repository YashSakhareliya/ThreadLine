import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    maxlength: [100, 'Shop name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Shop description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
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
  },
  address: {
    type: String
  },
  city: {
    type: String,
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  country: {
    type: String,
    default: 'India'
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300'
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  established: {
    type: Date,
    default: Date.now
  },
  businessLicense: {
    type: String
  },
  gstNumber: {
    type: String
  }
}, {
  timestamps: true
});

// Index for search functionality
shopSchema.index({ name: 'text', description: 'text', city: 'text' });

export default mongoose.model('Shop', shopSchema);
