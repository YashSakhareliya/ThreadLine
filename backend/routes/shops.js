import express from 'express';
import { body } from 'express-validator';
import {
  getAllShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  getShopFabrics
} from '../controllers/shopController.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import Shop from '../models/Shop.js';

const router = express.Router();

// Validation rules
const shopValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Shop name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required')
];

// Routes
router.route('/')
  .get(getAllShops)
  .post(protect, authorize('shop'), shopValidation, createShop);

router.route('/:id')
  .get(getShop)
  .put(protect, authorize('shop'), checkOwnership(Shop), updateShop)
  .delete(protect, authorize('shop'), checkOwnership(Shop), deleteShop);

router.route('/:id/fabrics')
  .get(getShopFabrics);

export default router;
