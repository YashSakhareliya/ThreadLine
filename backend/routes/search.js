import express from 'express';
import {
  globalSearch,
  getSearchSuggestions,
  nearbySearch
} from '../controllers/searchController.js';

const router = express.Router();

// Routes
router.get('/', globalSearch);
router.get('/suggestions', getSearchSuggestions);
router.get('/nearby', nearbySearch);

export default router;
