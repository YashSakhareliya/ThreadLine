# ThreadLine Backend API

Complete backend API for ThreadLine - Fabric and Tailoring E-commerce Platform

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Shop Management**: CRUD operations for fabric shops
- **Fabric Catalog**: Comprehensive fabric management with reviews and ratings
- **Tailor Profiles**: Tailor management with specializations and portfolios
- **Order Processing**: Complete order lifecycle with email notifications
- **Shopping Cart**: Persistent cart with stock validation
- **Image Upload**: Cloudinary integration for media storage
- **Search**: Global search across fabrics, shops, and tailors
- **Analytics**: Dashboard analytics and reporting
- **Email Service**: Automated email notifications

## Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ThreadLine-Phase-1/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update the connection string in `.env`

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/threadline
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `PUT /api/v1/auth/change-password` - Change password

### Shops
- `GET /api/v1/shops` - Get all shops
- `GET /api/v1/shops/:id` - Get shop by ID
- `POST /api/v1/shops` - Create shop (shop owners only)
- `PUT /api/v1/shops/:id` - Update shop
- `DELETE /api/v1/shops/:id` - Delete shop
- `GET /api/v1/shops/:id/fabrics` - Get shop fabrics

### Fabrics
- `GET /api/v1/fabrics` - Get all fabrics
- `GET /api/v1/fabrics/:id` - Get fabric by ID
- `POST /api/v1/shops/:shopId/fabrics` - Create fabric
- `PUT /api/v1/fabrics/:id` - Update fabric
- `DELETE /api/v1/fabrics/:id` - Delete fabric
- `POST /api/v1/fabrics/:id/reviews` - Add fabric review

### Tailors
- `GET /api/v1/tailors` - Get all tailors
- `GET /api/v1/tailors/:id` - Get tailor by ID
- `POST /api/v1/tailors` - Create tailor profile
- `PUT /api/v1/tailors/:id` - Update tailor profile
- `DELETE /api/v1/tailors/:id` - Delete tailor profile
- `POST /api/v1/tailors/:id/reviews` - Add tailor review

### Orders
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/:id/status` - Update order status
- `PUT /api/v1/orders/:id/cancel` - Cancel order

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update/:fabricId` - Update cart item quantity
- `DELETE /api/v1/cart/remove/:fabricId` - Remove item from cart
- `DELETE /api/v1/cart/clear` - Clear cart

## Data Models

### User Roles
- **Customer**: Can browse, purchase, and review
- **Shop**: Can manage shop and fabrics
- **Tailor**: Can manage tailor profile and services

### Key Entities
- **User**: Authentication and profile data
- **Shop**: Fabric shop information
- **Fabric**: Product catalog with specifications
- **Tailor**: Service provider profiles
- **Order**: Purchase transactions
- **Cart**: Shopping cart management

## Security Features

- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}, // Response data
  "count": 10, // For list endpoints
  "pagination": {} // For paginated endpoints
}
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure CORS origins
5. Set up process manager (PM2)
6. Configure reverse proxy (Nginx)

## Health Check

- `GET /api/v1/health` - API health status

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License
