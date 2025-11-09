import express from 'express';
import {
  globalSearch,
  getSearchSuggestions,
  nearbySearch,
  getAllCities
} from '../controllers/searchController.js';

const router = express.Router();

// Routes
router.get('/', globalSearch);
router.get('/suggestions', getSearchSuggestions);
router.get('/nearby', nearbySearch);
router.get('/cities', getAllCities);

export default router;
