import express from 'express';
import {
  globalSearch,
  getSearchSuggestions
} from '../controllers/searchController.js';

const router = express.Router();

// Routes
router.get('/', globalSearch);
router.get('/suggestions', getSearchSuggestions);

export default router;
