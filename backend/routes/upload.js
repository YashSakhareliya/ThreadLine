import express from 'express';
import {
  uploadImage,
  uploadImages,
  deleteImage
} from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Routes
router.post('/image', protect, upload.single('image'), uploadImage);
router.post('/images', protect, upload.array('images', 10), uploadImages);
router.delete('/image/:publicId', protect, deleteImage);

export default router;
