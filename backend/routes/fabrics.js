import express from 'express';
import { body } from 'express-validator';
import {
  getAllFabrics,
  getFabric,
  createFabric,
  updateFabric,
  deleteFabric,
  addFabricReview
} from '../controllers/fabricController.js';
import { protect, authorize, optionalAuth, checkOwnership } from '../middleware/auth.js';
import Fabric from '../models/Fabric.js';

const router = express.Router();

// Validation rules
const fabricValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Fabric name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').isIn(['Cotton', 'Silk', 'Wool', 'Linen', 'Synthetic', 'Blended', 'Other']).withMessage('Invalid category'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('material').trim().notEmpty().withMessage('Material is required'),
  body('width').trim().notEmpty().withMessage('Width is required'),
  body('image').isURL().withMessage('Please provide a valid image URL')
];

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters')
];

// Routes
router.route('/')
  .get(optionalAuth, getAllFabrics);

router.route('/:id')
  .get(optionalAuth, getFabric)
  .put(protect, authorize('shop'), updateFabric)
  .delete(protect, authorize('shop'), deleteFabric);

router.route('/:id/reviews')
  .post(protect, authorize('customer'), reviewValidation, addFabricReview);

export default router;
