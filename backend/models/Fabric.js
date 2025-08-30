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

const fabricSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Fabric name is required'],
    trim: true,
    maxlength: [100, 'Fabric name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Fabric description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Cotton', 'Silk', 'Wool', 'Linen', 'Synthetic', 'Blended', 'Other']
  },
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  material: {
    type: String,
    required: [true, 'Material is required']
  },
  width: {
    type: String,
    required: [true, 'Width is required']
  },
  image: {
    type: String,
    required: [true, 'Main image is required']
  },
  images: [{
    type: String
  }],
  specifications: {
    weight: String,
    weave: String,
    care: String,
    origin: String,
    thread_count: String
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for search functionality
fabricSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text', 
  color: 'text', 
  material: 'text' 
});

// Index for filtering
fabricSchema.index({ category: 1, price: 1, color: 1 });

export default mongoose.model('Fabric', fabricSchema);
