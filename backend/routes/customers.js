import express from 'express';
import {
  getCustomerProfile,
  updateCustomerProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addFavoriteShop,
  removeFavoriteShop,
  addFavoriteTailor,
  removeFavoriteTailor,
  getDashboardStats,
  updateCustomerLocation
} from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Profile routes
router.get('/profile', getCustomerProfile);
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('email').optional().isEmail(),
  body('phone').optional().matches(/^\+?[1-9]\d{1,14}$/),
  body('city').optional().trim().isLength({ min: 1 })
], updateCustomerProfile);

// Address routes
router.post('/addresses', [
  body('name').trim().notEmpty().withMessage('Address name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number is required')
], addAddress);

router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Favorites routes
router.post('/favorites/shops/:shopId', addFavoriteShop);
router.delete('/favorites/shops/:shopId', removeFavoriteShop);
router.post('/favorites/tailors/:tailorId', addFavoriteTailor);
router.delete('/favorites/tailors/:tailorId', removeFavoriteTailor);

// Dashboard route
router.get('/dashboard', getDashboardStats);

// Location update route
router.put('/location', [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
], updateCustomerLocation);

export default router;
