import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: [500, 'Review comment cannot exceed 500 characters']
  },
  images: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

const tailorSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Tailor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
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
  city: {
    type: String,
    required: [true, 'City is required']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
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
  specialization: [{
    type: String,
    required: true,
    enum: ['Suits', 'Shirts', 'Traditional Wear', 'Sarees', 'Lehengas', 'Blouses', 'Casual Wear', 'Formal Wear', 'Alterations']
  }],
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  priceRange: {
    type: String,
    required: [true, 'Price range is required']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x300'
  },
  portfolio: [{
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
  reviews: [reviewSchema],
  completedProjects: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '24 hours'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Not Available'],
    default: 'Available'
  },
  workingHours: {
    start: String,
    end: String
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
  }
}, {
  timestamps: true
});

// Index for search functionality
tailorSchema.index({ 
  name: 'text', 
  bio: 'text', 
  city: 'text', 
  specialization: 'text' 
});

// Index for filtering
tailorSchema.index({ city: 1, specialization: 1, rating: 1 });

export default mongoose.model('Tailor', tailorSchema);
