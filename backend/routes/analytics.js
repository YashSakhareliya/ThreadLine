import express from 'express';
import {
  getDashboard,
  getShopDashboard
} from '../controllers/analyticsController.js';
import { protect, authorize, adminOnly, checkOwnership } from '../middleware/auth.js';
import Shop from '../models/Shop.js';

const router = express.Router();

// Routes
router.get('/dashboard', protect, adminOnly, getDashboard);

// Shop analytics - only shop owners can view their own analytics, admins can view all
router.get('/shop/:shopId', protect, (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  if (req.user.role === 'shop') {
    req.params.id = req.params.shopId; // Set id for ownership check
    return checkOwnership(Shop)(req, res, next);
  }
  return res.status(403).json({
    success: false,
    message: 'Not authorized to access shop analytics'
  });
}, getShopDashboard);

export default router;
