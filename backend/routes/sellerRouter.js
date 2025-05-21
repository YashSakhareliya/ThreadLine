const express = require('express');
const router = express.Router();
const {
    addSeller,
    getAllSellers,
    getSellerById,
    updateSeller,
    deleteSeller
} = require('../controllers/sellerController');

// @route   POST /api/sellers
// @desc    Add a new seller
// @access  Private (Only Admin can add a seller)
router.post('/', addSeller);

// @route   GET /api/sellers
// @desc    Get all sellers
// @access  Public
router.get('/', getAllSellers);

// @route   GET /api/sellers/:id
// @desc    Get seller by ID
// @access  Public
router.get('/:id', getSellerById);

// @route   PUT /api/sellers/:id
// @desc    Update seller by ID
// @access  Private (Only Admin can update seller information)
router.put('/:id', updateSeller);

// @route   DELETE /api/sellers/:id
// @desc    Delete seller by ID
// @access  Private (Only Admin can delete a seller)
router.delete('/:id', deleteSeller);

module.exports = router;
