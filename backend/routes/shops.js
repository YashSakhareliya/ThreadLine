import express from 'express';
import { body } from 'express-validator';
import {
  getAllShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  getShopFabrics,
  getNearbyShops,
  recalculateShopRating,
  recalculateAllRatings
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
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180')
];

// Routes
router.route('/')
  .get(getAllShops)
  .post(protect, authorize('shop'), shopValidation, createShop);

router.route('/nearby')
  .get(getNearbyShops);

// Admin route to recalculate all shop ratings
router.route('/recalculate-all-ratings')
  .put(protect, authorize('admin'), recalculateAllRatings);

router.route('/:id')
  .get(getShop)
  .put(protect, authorize('shop'), checkOwnership(Shop), updateShop)
  .delete(protect, authorize('shop'), checkOwnership(Shop), deleteShop);

router.route('/:id/fabrics')
  .get(getShopFabrics);

// Shop owner or admin can recalculate individual shop rating
router.route('/:id/recalculate-rating')
  .put(protect, recalculateShopRating);

export default router;
