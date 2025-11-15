# ThreadLine Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [API Endpoints](#api-endpoints)
4. [Data Flow](#data-flow)
5. [Request/Response Formats](#requestresponse-formats)
6. [Error Handling](#error-handling)
7. [Contribution Guidelines](#contribution-guidelines)
8. [Setup & Development](#setup--development)

---

## Overview

ThreadLine Backend API is a RESTful service built with Node.js, Express.js, and MongoDB. It provides comprehensive e-commerce functionality for fabric shops, tailors, and customers.

### Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

---

## Authentication & Authorization

### Authentication Flow
```
1. User registers/logs in → JWT token generated
2. Token sent in Authorization header: `Bearer <token>`
3. Middleware verifies token and extracts user info
4. Role-based access control applied
```

### User Roles
- **customer**: Can browse, purchase, review products
- **shop**: Can manage shop profile and fabrics
- **tailor**: Can manage tailor profile and handle inquiries
- **admin**: Full platform access (future implementation)

### Middleware Types
- `protect`: Requires valid JWT token
- `authorize(roles)`: Requires specific user roles
- `optionalAuth`: Optional authentication (adds user if token present)
- `checkOwnership(Model)`: Ensures user owns the resource
- `adminOnly`: Admin-only access

---

## API Endpoints

### 1. Authentication Routes (`/api/v1/auth`)

#### Register User
```http
POST /api/v1/auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer", // optional: customer|shop|tailor
  "phone": "+1234567890", // optional
  "address": { // optional
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "jwt_token_here",
    "profile": {} // Additional profile data if tailor/shop
  }
}
```

#### Login User
```http
POST /api/v1/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

#### Get Current User Profile
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/v1/auth/profile
Authorization: Bearer <token>
```

#### Change Password
```http
PUT /api/v1/auth/change-password
Authorization: Bearer <token>
```

---

### 2. Shop Routes (`/api/v1/shops`)

#### Get All Shops
```http
GET /api/v1/shops?page=1&limit=10&city=Mumbai&rating=4
```
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `city`: Filter by city
- `rating`: Minimum rating filter
- `sort`: Sort by (rating, name, createdAt)

#### Get Shop Details
```http
GET /api/v1/shops/:id
```

#### Create Shop (Shop Owner Only)
```http
POST /api/v1/shops
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Fabric Paradise",
  "description": "Premium fabric collection",
  "email": "shop@example.com",
  "phone": "+1234567890",
  "address": "123 Market Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India",
  "image": "https://cloudinary.com/image.jpg",
  "businessLicense": "BL123456",
  "gstNumber": "GST123456789"
}
```

#### Update Shop (Shop Owner Only)
```http
PUT /api/v1/shops/:id
Authorization: Bearer <token>
```

#### Delete Shop (Shop Owner Only)
```http
DELETE /api/v1/shops/:id
Authorization: Bearer <token>
```

#### Get Shop Fabrics
```http
GET /api/v1/shops/:id/fabrics
```

#### Recalculate Shop Rating (Shop Owner/Admin)
```http
PUT /api/v1/shops/:id/recalculate-rating
Authorization: Bearer <token>
```
**Description:** Recalculates shop rating based on average of all fabric reviews. Updates both `rating` and `totalReviews` fields.

**Response:**
```json
{
  "success": true,
  "message": "Shop rating recalculated successfully",
  "data": {
    "totalReviews": 45,
    "rating": 4.35
  }
}
```

#### Recalculate All Shop Ratings (Admin Only)
```http
PUT /api/v1/shops/recalculate-all-ratings
Authorization: Bearer <token>
```
**Description:** Recalculates ratings for all active shops. Useful for data maintenance and migrations.

**Response:**
```json
{
  "success": true,
  "message": "All shop ratings recalculated successfully",
  "data": {
    "updated": 50,
    "failed": 0,
    "errors": []
  }
}
```

#### Get Shop Orders (Shop Owner Only)
```http
GET /api/v1/shops/:id/orders
Authorization: Bearer <token>
```

---

### 3. Fabric Routes (`/api/v1/fabrics`)

#### Get All Fabrics
```http
GET /api/v1/fabrics?category=Cotton&minPrice=100&maxPrice=1000&color=Red
```
**Query Parameters:**
- `category`: Filter by category
- `minPrice`, `maxPrice`: Price range filter
- `color`: Filter by color
- `material`: Filter by material
- `shop`: Filter by shop ID
- `page`, `limit`: Pagination

#### Get Fabric Details
```http
GET /api/v1/fabrics/:id
```

#### Update Fabric (Shop Owner Only)
```http
PUT /api/v1/fabrics/:id
Authorization: Bearer <token>
```

#### Delete Fabric (Shop Owner Only)
```http
DELETE /api/v1/fabrics/:id
Authorization: Bearer <token>
```

#### Add Fabric Review (Customer Only)
```http
POST /api/v1/fabrics/:id/reviews
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent quality fabric!",
  "images": ["https://cloudinary.com/review1.jpg"] // optional
}
```

**Auto-Updates:**
- Updates fabric's average rating
- Increments shop's total review count
- Recalculates shop's average rating based on all fabric reviews

---

### 4. Shop Fabric Routes (`/api/v1/shops/:shopId/fabrics`)

#### Create Fabric for Shop (Shop Owner Only)
```http
POST /api/v1/shops/:shopId/fabrics
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "name": "Premium Cotton",
  "description": "High-quality cotton fabric perfect for shirts",
  "price": 299.99,
  "stock": 100,
  "category": "Cotton",
  "color": "White",
  "material": "100% Cotton",
  "width": "44 inches",
  "image": "https://cloudinary.com/fabric.jpg",
  "images": ["https://cloudinary.com/fabric2.jpg"], // optional
  "specifications": {
    "weight": "150 GSM",
    "weave": "Plain",
    "care": "Machine wash cold",
    "origin": "India",
    "thread_count": "200"
  },
  "tags": ["premium", "cotton", "shirts"] // optional
}
```

---

### 5. Tailor Routes (`/api/v1/tailors`)

#### Get All Tailors
```http
GET /api/v1/tailors?city=Mumbai&specialization=Suits&experience=5&rating=4
```

#### Get Tailor Details
```http
GET /api/v1/tailors/:id
```

#### Create Tailor Profile (Tailor Only)
```http
POST /api/v1/tailors
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "name": "Master Tailor",
  "bio": "Expert in traditional and modern tailoring",
  "email": "tailor@example.com",
  "phone": "+1234567890",
  "city": "Mumbai",
  "specialization": ["Suits", "Shirts", "Traditional Wear"],
  "experience": 10,
  "priceRange": "₹500 - ₹2000",
  "image": "https://cloudinary.com/tailor.jpg",
  "portfolio": ["https://cloudinary.com/work1.jpg"],
  "workingHours": {
    "start": "09:00",
    "end": "18:00"
  },
  "address": {
    "street": "123 Tailor Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

#### Update Tailor Profile (Tailor Owner Only)
```http
PUT /api/v1/tailors/:id
Authorization: Bearer <token>
```

#### Add Tailor Review (Customer Only)
```http
POST /api/v1/tailors/:id/reviews
Authorization: Bearer <token>
```

#### Send Inquiry to Tailor (Customer Only)
```http
POST /api/v1/tailors/:id/inquiries
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "subject": "Custom Suit Inquiry",
  "message": "I would like to get a custom suit made. Can we discuss the details?"
}
```

#### Get Tailor Inquiries (Tailor Owner Only)
```http
GET /api/v1/tailors/:id/inquiries
Authorization: Bearer <token>
```

#### Reply to Inquiry (Tailor Owner Only)
```http
POST /api/v1/tailors/:id/inquiries/:inquiryId/reply
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "message": "Thank you for your inquiry. I would be happy to help you with a custom suit."
}
```

---

### 6. Cart Routes (`/api/v1/cart`)

#### Get User Cart
```http
GET /api/v1/cart
Authorization: Bearer <token>
```

#### Add Item to Cart
```http
POST /api/v1/cart/add
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "fabricId": "fabric_id_here",
  "quantity": 2 // optional, defaults to 1
}
```

#### Update Cart Item Quantity
```http
PUT /api/v1/cart/update/:fabricId
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /api/v1/cart/remove/:fabricId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /api/v1/cart/clear
Authorization: Bearer <token>
```

---

### 7. Order Routes (`/api/v1/orders`)

#### Get User Orders
```http
GET /api/v1/orders?status=Pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Create Order (Customer Only)
```http
POST /api/v1/orders
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "items": [
    {
      "fabricId": "fabric_id_1",
      "quantity": 2
    },
    {
      "fabricId": "fabric_id_2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "phone": "+1234567890",
    "country": "India"
  },
  "paymentMethod": "COD", // COD|Credit Card|Debit Card|UPI|Net Banking|Wallet
  "shippingMethod": "Standard Delivery", // Standard|Express|Same Day
  "notes": "Please handle with care" // optional
}
```

#### Get Order Details
```http
GET /api/v1/orders/:id
Authorization: Bearer <token>
```

#### Update Order Status (Admin Only)
```http
PUT /api/v1/orders/:id/status
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "status": "Shipped" // Pending|Confirmed|Processing|Shipped|Delivered|Cancelled|Refunded
}
```

#### Cancel Order
```http
PUT /api/v1/orders/:id/cancel
Authorization: Bearer <token>
```

---

### 8. Customer Routes (`/api/v1/customers`)

#### Get Customer Profile
```http
GET /api/v1/customers/profile
Authorization: Bearer <token>
```

#### Update Customer Profile
```http
PUT /api/v1/customers/profile
Authorization: Bearer <token>
```

#### Add Address
```http
POST /api/v1/customers/addresses
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "name": "Home Address",
  "address": "123 Home Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "phone": "+1234567890",
  "country": "India",
  "isDefault": true
}
```

#### Update Address
```http
PUT /api/v1/customers/addresses/:addressId
Authorization: Bearer <token>
```

#### Delete Address
```http
DELETE /api/v1/customers/addresses/:addressId
Authorization: Bearer <token>
```

#### Add Favorite Shop
```http
POST /api/v1/customers/favorites/shops/:shopId
Authorization: Bearer <token>
```

#### Remove Favorite Shop
```http
DELETE /api/v1/customers/favorites/shops/:shopId
Authorization: Bearer <token>
```

#### Add Favorite Tailor
```http
POST /api/v1/customers/favorites/tailors/:tailorId
Authorization: Bearer <token>
```

#### Remove Favorite Tailor
```http
DELETE /api/v1/customers/favorites/tailors/:tailorId
Authorization: Bearer <token>
```

#### Get Dashboard Stats
```http
GET /api/v1/customers/dashboard
Authorization: Bearer <token>
```

---

### 9. Search Routes (`/api/v1/search`)

#### Global Search
```http
GET /api/v1/search?q=cotton&type=all&page=1&limit=20
```
**Query Parameters:**
- `q`: Search query (minimum 2 characters)
- `type`: Search type (all|fabrics|shops|tailors)
- `page`, `limit`: Pagination

#### Get Search Suggestions
```http
GET /api/v1/search/suggestions?q=cot
```

---

### 10. Upload Routes (`/api/v1/upload`)

#### Upload Single Image
```http
POST /api/v1/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Form Data:**
- `image`: Image file (max 10MB)

#### Upload Multiple Images
```http
POST /api/v1/upload/images
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Form Data:**
- `images`: Array of image files (max 10 files, 10MB each)

#### Delete Image
```http
DELETE /api/v1/upload/image/:publicId
Authorization: Bearer <token>
```

---

### 11. Analytics Routes (`/api/v1/analytics`)

#### Get Platform Dashboard (Admin Only)
```http
GET /api/v1/analytics/dashboard
Authorization: Bearer <token>
```

#### Get Shop Analytics (Shop Owner/Admin Only)
```http
GET /api/v1/analytics/shop/:shopId
Authorization: Bearer <token>
```

---

## Data Flow

### 1. User Registration & Authentication Flow
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Client    │    │   Auth API   │    │  Database   │    │   Business   │
│             │    │              │    │             │    │   Logic      │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
       │                   │                   │                   │
       │ POST /auth/register                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ Validate input    │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │ Check existing    │
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │                   │ Create User       │
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │                   │ Create Profile    │
       │                   │                   │ (if shop/tailor)  │
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │ Generate JWT      │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │                   │
       │ Return user + token                   │                   │
       │<──────────────────┤                   │                   │
```

### 2. E-commerce Purchase Flow
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  Customer   │    │   Cart API   │    │  Order API  │    │   Payment    │
│             │    │              │    │             │    │   Gateway    │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
       │                   │                   │                   │
       │ Add to Cart       │                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ Update Cart       │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │                   │
       │ Checkout          │                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ Create Order      │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │ Process Payment   │
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │                   │ Update Stock      │
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │ Clear Cart        │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │                   │
       │ Order Confirmation│                   │                   │
       │<──────────────────┤                   │                   │
```

### 3. Shop Management Flow
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Shop Owner  │    │  Shop API    │    │ Fabric API  │    │  Analytics   │
│             │    │              │    │             │    │     API      │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
       │                   │                   │                   │
       │ Create Shop       │                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ Verify Ownership  │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │                   │
       │ Add Fabrics       │                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ Create Fabric     │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │                   │
       │ View Analytics    │                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ Get Shop Stats    │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │ Calculate Metrics │
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │ Dashboard Data    │                   │                   │
       │<──────────────────┤                   │                   │
```

---

## Request/Response Formats

### Standard Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "message": "Human readable message",
  "data": {}, // Response data (if success)
  "error": {}, // Error details (if failure)
  "pagination": { // For paginated responses
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  },
  "errors": [ // Validation errors
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Pagination Format
For list endpoints that support pagination:
```json
{
  "success": true,
  "count": 10, // Items in current response
  "total": 100, // Total items available
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "data": []
}
```

---

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - Valid token required
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DUPLICATE_RESOURCE` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## Contribution Guidelines

### Getting Started for Contributors

#### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/your-username/threadline.git
cd threadline/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Configure your environment variables

# Start MongoDB (ensure MongoDB is running)
mongod

# Start development server
npm run dev
```

#### 2. Environment Variables
Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/threadline
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (optional)
EMAIL_FROM=noreply@threadline.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Development Guidelines

#### 1. Code Structure
```
backend/
├── config/           # Configuration files
├── controllers/      # Route handlers
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
├── scripts/         # Database scripts
└── server.js        # Entry point
```

#### 2. Adding New Features

##### Step 1: Create Model (if needed)
```javascript
// models/NewModel.js
import mongoose from 'mongoose';

const newModelSchema = new mongoose.Schema({
  // Define schema fields
}, {
  timestamps: true
});

export default mongoose.model('NewModel', newModelSchema);
```

##### Step 2: Create Controller
```javascript
// controllers/newController.js
import NewModel from '../models/NewModel.js';

export const createNew = async (req, res) => {
  try {
    const newItem = await NewModel.create(req.body);
    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
```

##### Step 3: Create Routes
```javascript
// routes/new.js
import express from 'express';
import { createNew } from '../controllers/newController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createNew);

export default router;
```

##### Step 4: Register Routes
```javascript
// server.js
import newRoutes from './routes/new.js';
app.use('/api/v1/new', newRoutes);
```

#### 3. Testing Guidelines
```javascript
// tests/new.test.js
import request from 'supertest';
import app from '../server.js';

describe('New Feature', () => {
  test('should create new item', async () => {
    const response = await request(app)
      .post('/api/v1/new')
      .set('Authorization', `Bearer ${token}`)
      .send({
        // test data
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

#### 4. Validation Guidelines
Always add input validation:
```javascript
import { body } from 'express-validator';

const validation = [
  body('field').trim().isLength({ min: 1 }).withMessage('Field is required'),
  body('email').isEmail().withMessage('Valid email required')
];
```

#### 5. Error Handling
Use consistent error handling:
```javascript
export const controllerFunction = async (req, res) => {
  try {
    // Controller logic
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

### API Documentation Standards

#### 1. Route Documentation Format
```javascript
// @desc    Description of what the endpoint does
// @route   HTTP_METHOD /api/v1/endpoint
// @access  Public/Private/Admin
// @params  List of parameters
// @body    Request body structure
// @returns Response structure
```

#### 2. Model Documentation
Document all model fields and relationships:
```javascript
/**
 * User Model
 * @description Represents a user in the system
 * @fields
 *   - name: User's full name (required)
 *   - email: User's email address (required, unique)
 *   - role: User role (customer|shop|tailor)
 * @relationships
 *   - hasOne: Shop (if role is shop)
 *   - hasOne: Tailor (if role is tailor)
 *   - hasMany: Orders (if role is customer)
 */
```

### Pull Request Guidelines

#### 1. Before Submitting
- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Environment variables documented

#### 2. PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Database Guidelines

#### 1. Model Conventions
- Use singular names for models (User, not Users)
- Use camelCase for field names
- Add timestamps: true for audit trails
- Include proper validation and constraints

#### 2. Index Guidelines
```javascript
// Add indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });

// Text indexes for search
fabricSchema.index({ 
  name: 'text', 
  description: 'text' 
});
```

#### 3. Migration Scripts
Create migration scripts for database changes:
```javascript
// scripts/migrations/001_add_new_field.js
import mongoose from 'mongoose';
import User from '../models/User.js';

export const up = async () => {
  await User.updateMany({}, { $set: { newField: 'defaultValue' } });
};

export const down = async () => {
  await User.updateMany({}, { $unset: { newField: 1 } });
};
```

### Security Guidelines

#### 1. Input Validation
Always validate and sanitize input:
```javascript
import { body, validationResult } from 'express-validator';

const validate = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).escape()
];
```

#### 2. Authentication
Protect sensitive routes:
```javascript
router.get('/sensitive', protect, authorize('admin'), controller);
```

#### 3. Data Exposure
Never expose sensitive data:
```javascript
// Remove sensitive fields
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  return user;
};
```

---

## Setup & Development

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB
mongod

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run test suite
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Database Seeding
```bash
# Seed database with sample data
npm run seed

# Clear database
npm run seed:clear
```

---

This documentation provides comprehensive information for developers contributing to the ThreadLine backend API. For additional questions or clarifications, please refer to the project's GitHub issues or contact the development team.
