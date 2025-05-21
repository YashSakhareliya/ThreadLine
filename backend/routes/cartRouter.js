const express = require('express');
const router = express.Router();

// Import necessary controllers
const {
    addItemToCart,
    getCartByCustomer,
    removeItemFromCart,
    updateItemQuantity,
    clearCart
} = require('../controllers/cartController');

// @route   POST /api/cart
// @desc    Add an item to the cart
// @access  Public
router.post('/', addItemToCart);

// @route   GET /api/cart/:customerId
// @desc    Get the cart of a customer
// @access  Public
router.get('/:customerId', getCartByCustomer);

// @route   DELETE /api/cart/:cartId/item/:itemId
// @desc    Remove an item from the cart
// @access  Public
router.delete('/:cartId/item/:itemId', removeItemFromCart);

// @route   PUT /api/cart/:cartId/item/:itemId
// @desc    Update the quantity of an item in the cart
// @access  Public
router.put('/:cartId/item/:itemId', updateItemQuantity);

// @route   DELETE /api/cart/:cartId
// @desc    Clear the cart (remove all items)
// @access  Public
router.delete('/:cartId', clearCart);

module.exports = router;
