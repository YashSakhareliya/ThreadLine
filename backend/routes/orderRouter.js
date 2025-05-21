const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrdersByCustomer,
    getOrdersByTailor,
    getOrdersBySeller,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', createOrder);

// @route   GET /api/orders/customer/:customerId
// @desc    Get all orders for a customer
// @access  Private
router.get('/customer/:customerId', getOrdersByCustomer);

// @route   GET /api/orders/tailor/:tailorId
// @desc    Get all orders for a tailor
// @access  Private
router.get('/tailor/:tailorId', getOrdersByTailor);

// @route   GET /api/orders/seller/:sellerId
// @desc    Get all orders for a seller
// @access  Private
router.get('/seller/:sellerId', getOrdersBySeller);

// @route   GET /api/orders/:id
// @desc    Get a specific order by ID
// @access  Private
router.get('/:id', getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Update the order status
// @access  Private
router.put('/:id/status', updateOrderStatus);

// @route   DELETE /api/orders/:id
// @desc    Delete an order by ID
// @access  Private
router.delete('/:id', deleteOrder);

module.exports = router;
