# ThreadLine API Testing Guide

This guide provides comprehensive testing instructions for the ThreadLine backend API.

## Prerequisites

1. **Start the server:**
```bash
cd backend
npm run dev
```

2. **Seed test data:**
```bash
npm run seed
```

3. **API Base URL:** `http://localhost:5000/api/v1`

## Testing Tools

- **Postman** (Recommended)
- **cURL** commands
- **Thunder Client** (VS Code extension)
- **Insomnia**

## Authentication Flow

### 1. Register a New User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "customer"
}
```

### 2. Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response includes JWT token:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 3. Use Token in Headers
For protected routes, include the token:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Test Scenarios

### Authentication Tests

1. **Valid Registration**
   - Should return 201 with user data and token
   
2. **Duplicate Email Registration**
   - Should return 400 error
   
3. **Invalid Login Credentials**
   - Should return 401 error
   
4. **Access Protected Route Without Token**
   - Should return 401 error

### Shop Management Tests

1. **Get All Shops (Public)**
```bash
GET /api/v1/shops
```

2. **Create Shop (Shop Role Required)**
```bash
POST /api/v1/shops
Authorization: Bearer SHOP_USER_TOKEN
Content-Type: application/json

{
  "name": "Premium Fabrics",
  "description": "High-quality fabric store",
  "address": "123 Main St",
  "city": "New York",
  "phone": "+1234567890",
  "email": "info@premiumfabrics.com"
}
```

3. **Update Shop (Owner Only)**
```bash
PUT /api/v1/shops/:shopId
Authorization: Bearer SHOP_OWNER_TOKEN
Content-Type: application/json

{
  "name": "Updated Shop Name",
  "description": "Updated description"
}
```

### Fabric Management Tests

1. **Get All Fabrics with Filters**
```bash
GET /api/v1/fabrics?category=cotton&minPrice=10&maxPrice=100&page=1&limit=10
```

2. **Create Fabric (Shop Owner Only)**
```bash
POST /api/v1/shops/:shopId/fabrics
Authorization: Bearer SHOP_OWNER_TOKEN
Content-Type: application/json

{
  "name": "Premium Cotton",
  "description": "High-quality cotton fabric",
  "price": 25.99,
  "category": "cotton",
  "color": "white",
  "material": "100% cotton",
  "stock": 100,
  "specifications": {
    "weight": "200gsm",
    "width": "150cm",
    "care": "Machine washable"
  }
}
```

3. **Add Fabric Review (Customer Only)**
```bash
POST /api/v1/fabrics/:fabricId/reviews
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent quality fabric!"
}
```

### Cart Management Tests

1. **Add Item to Cart**
```bash
POST /api/v1/cart/add
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "fabricId": "FABRIC_ID",
  "quantity": 2
}
```

2. **Update Cart Item Quantity**
```bash
PUT /api/v1/cart/update/:fabricId
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "quantity": 5
}
```

3. **Get Cart**
```bash
GET /api/v1/cart
Authorization: Bearer CUSTOMER_TOKEN
```

### Order Management Tests

1. **Create Order**
```bash
POST /api/v1/orders
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "fabric": "FABRIC_ID",
      "quantity": 2,
      "price": 25.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

2. **Get User Orders**
```bash
GET /api/v1/orders
Authorization: Bearer CUSTOMER_TOKEN
```

3. **Update Order Status (Shop Owner)**
```bash
PUT /api/v1/orders/:orderId/status
Authorization: Bearer SHOP_OWNER_TOKEN
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

### Search Tests

1. **Global Search**
```bash
GET /api/v1/search?q=cotton&type=fabrics&page=1&limit=10
```

2. **Search Suggestions**
```bash
GET /api/v1/search/suggestions?q=cot
```

### Image Upload Tests

1. **Upload Single Image**
```bash
POST /api/v1/upload/single
Authorization: Bearer USER_TOKEN
Content-Type: multipart/form-data

image: [SELECT_IMAGE_FILE]
```

2. **Upload Multiple Images**
```bash
POST /api/v1/upload/multiple
Authorization: Bearer USER_TOKEN
Content-Type: multipart/form-data

images: [SELECT_MULTIPLE_IMAGE_FILES]
```

## Test Data

After running `npm run seed`, you'll have:

### Test Users
- **Admin**: admin@threadline.com / password123
- **Shop Owner**: shop1@threadline.com / password123
- **Customer**: customer1@threadline.com / password123
- **Tailor**: tailor1@threadline.com / password123

### Test Shops
- Multiple fabric shops with different categories
- Each shop has associated fabrics

### Test Fabrics
- Various fabric types (cotton, silk, wool, etc.)
- Different price ranges and specifications

## Error Testing

### Common Error Scenarios

1. **Invalid Input Validation**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "",
  "email": "invalid-email",
  "password": "123"
}
```
Expected: 400 Bad Request with validation errors

2. **Unauthorized Access**
```bash
POST /api/v1/shops
# No Authorization header
```
Expected: 401 Unauthorized

3. **Forbidden Access**
```bash
PUT /api/v1/shops/:shopId
Authorization: Bearer CUSTOMER_TOKEN
# Customer trying to update shop
```
Expected: 403 Forbidden

4. **Resource Not Found**
```bash
GET /api/v1/shops/invalid-shop-id
```
Expected: 404 Not Found

## Performance Testing

### Rate Limiting Test
Make more than 100 requests within 15 minutes to test rate limiting:
```bash
# Should return 429 Too Many Requests after 100 requests
```

### Pagination Test
```bash
GET /api/v1/fabrics?page=1&limit=5
GET /api/v1/fabrics?page=2&limit=5
```

## Health Check

Always start testing with:
```bash
GET /api/v1/health
```

Expected response:
```json
{
  "success": true,
  "message": "ThreadLine API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## Postman Collection

Import this collection structure into Postman:

```json
{
  "info": {
    "name": "ThreadLine API",
    "description": "Complete API testing collection"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}"
      }
    ]
  }
}
```

## Troubleshooting

### Common Issues

1. **Server Not Starting**
   - Check if MongoDB is running
   - Verify environment variables in `.env`
   - Check port availability

2. **Authentication Errors**
   - Verify JWT token format
   - Check token expiration
   - Ensure correct Authorization header format

3. **Database Errors**
   - Verify MongoDB connection string
   - Check database permissions
   - Ensure collections are created

4. **Image Upload Errors**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure correct content-type

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide detailed error messages and request logs.
