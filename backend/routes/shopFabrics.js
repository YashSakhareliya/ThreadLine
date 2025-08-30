import express from 'express';
import { body } from 'express-validator';
import { createFabric } from '../controllers/fabricController.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import Shop from '../models/Shop.js';

const router = express.Router({ mergeParams: true });

// Validation rules
const fabricValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Fabric name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').isIn(['Cotton', 'Silk', 'Wool', 'Linen', 'Synthetic', 'Blended', 'Other']).withMessage('Invalid category'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('material').trim().notEmpty().withMessage('Material is required'),
  body('width').trim().notEmpty().withMessage('Width is required'),
  body('image').isURL().withMessage('Please provide a valid image URL')
];

// Routes
router.route('/')
  .post(
    protect,
    authorize('shop'),
    // ensure the authenticated shop user owns the shop specified by :shopId
    (req, res, next) => { req.params.id = req.params.shopId; next(); },
    checkOwnership(Shop),
    fabricValidation,
    createFabric
  );

export default router;
