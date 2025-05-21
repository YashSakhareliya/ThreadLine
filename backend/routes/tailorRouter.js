const express = require('express');
const router = express.Router();
const {
    addTailor,
    getAllTailors,
    getTailorById,
    updateTailor,
    deleteTailor
} = require('../controllers/tailorController');

// @route   POST /api/tailors
// @desc    Add a new tailor
// @access  Private (Only Admin or Seller can add a tailor)
router.post('/', addTailor);

// @route   GET /api/tailors
// @desc    Get all tailors
// @access  Public
router.get('/', getAllTailors);

// @route   GET /api/tailors/:id
// @desc    Get tailor by ID
// @access  Public
router.get('/:id', getTailorById);

// @route   PUT /api/tailors/:id
// @desc    Update tailor by ID
// @access  Private (Only Admin or Seller can update a tailor)
router.put('/:id', updateTailor);

// @route   DELETE /api/tailors/:id
// @desc    Delete tailor by ID
// @access  Private (Only Admin or Seller can delete a tailor)
router.delete('/:id', deleteTailor);

module.exports = router;
