import express from 'express';
import { body } from 'express-validator';
import {
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.fabricId').isMongoId().withMessage('Invalid fabric ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Recipient name is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  body('paymentMethod').optional().isIn(['COD', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet']).withMessage('Invalid payment method'),
  body('shippingMethod').optional().isIn(['Standard Delivery', 'Express Delivery', 'Same Day Delivery']).withMessage('Invalid shipping method')
];

const statusValidation = [
  body('status').isIn(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded']).withMessage('Invalid status')
];

// Routes
router.route('/')
  .get(protect, getMyOrders)
  .post(protect, authorize('customer'), orderValidation, createOrder);

router.route('/:id')
  .get(protect, getOrder);

router.route('/:id/status')
  .put(protect, authorize('admin'), statusValidation, updateOrderStatus);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

export default router;
