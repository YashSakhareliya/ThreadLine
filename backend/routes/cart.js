import express from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const addToCartValidation = [
  body('fabricId').isMongoId().withMessage('Invalid fabric ID'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const updateQuantityValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Routes
router.route('/')
  .get(protect, getCart);

router.route('/add')
  .post(protect, addToCartValidation, addToCart);

router.route('/update/:fabricId')
  .put(protect, updateQuantityValidation, updateCartItemQuantity);

router.route('/remove/:fabricId')
  .delete(protect, removeFromCart);

router.route('/clear')
  .delete(protect, clearCart);

export default router;
