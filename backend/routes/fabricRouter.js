const express = require('express');
const router = express.Router();

// Import necessary controllers
const {
    createFabric,
    getFabricsBySeller,
    getFabricById,
    getFabricsByCategory,
    updateFabric,
    deleteFabric
} = require('../controllers/fabricController');

// @route   POST /api/fabrics
// @desc    Create a new fabric (Only Sellers can add fabrics)
// @access  Private
router.post('/', createFabric);

// @route   GET /api/fabrics/seller/:sellerId
// @desc    Get all fabrics by seller (Only Sellers can view their fabrics)
// @access  Private
router.get('/seller/:sellerId', getFabricsBySeller);

// @route   GET /api/fabrics/:id
// @desc    Get a specific fabric by ID
// @access  Public
router.get('/:id', getFabricById);

// @route   GET /api/fabrics/category/:category
// @desc    Get all fabrics by category
// @access  Public
router.get('/category/:category', getFabricsByCategory);

// @route   PUT /api/fabrics/:id
// @desc    Update fabric details (Only Sellers can update their fabrics)
// @access  Private
router.put('/:id', updateFabric);

// @route   DELETE /api/fabrics/:id
// @desc    Delete a fabric (Only Sellers can delete their fabrics)
// @access  Private
router.delete('/:id', deleteFabric);

module.exports = router;
