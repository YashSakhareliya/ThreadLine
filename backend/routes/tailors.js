import express from 'express';
import { body } from 'express-validator';
import {
  getAllTailors,
  getTailor,
  createTailor,
  updateTailor,
  deleteTailor,
  addTailorReview
} from '../controllers/tailorController.js';
import {
  sendInquiry,
  getTailorInquiries,
  replyToInquiry
} from '../controllers/inquiryController.js';
import { protect, authorize, optionalAuth, checkOwnership } from '../middleware/auth.js';
import Tailor from '../models/Tailor.js';

const router = express.Router();

// Validation rules
const tailorValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('bio').trim().isLength({ min: 10, max: 1000 }).withMessage('Bio must be between 10 and 1000 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('specialization').isArray({ min: 1 }).withMessage('At least one specialization is required'),
  body('specialization.*').isIn(['Suits', 'Shirts', 'Traditional Wear', 'Sarees', 'Lehengas', 'Blouses', 'Casual Wear', 'Formal Wear', 'Alterations']).withMessage('Invalid specialization'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a non-negative number'),
  body('priceRange').trim().notEmpty().withMessage('Price range is required')
];

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters')
];

const inquiryValidation = [
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
];

const replyValidation = [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
];

// Routes
router.route('/')
  .get(optionalAuth, getAllTailors)
  .post(protect, authorize('tailor'), tailorValidation, createTailor);

router.route('/:id')
  .get(optionalAuth, getTailor)
  .put(protect, authorize('tailor'), checkOwnership(Tailor), updateTailor)
  .delete(protect, authorize('tailor'), checkOwnership(Tailor), deleteTailor);

router.route('/:id/reviews')
  .post(protect, authorize('customer'), reviewValidation, addTailorReview);

router.route('/:id/inquiries')
  .post(protect, authorize('customer'), inquiryValidation, sendInquiry)
  .get(protect, authorize('tailor'), getTailorInquiries);

router.route('/:id/inquiries/:inquiryId/reply')
  .post(protect, authorize('tailor'), replyValidation, replyToInquiry);

export default router;
