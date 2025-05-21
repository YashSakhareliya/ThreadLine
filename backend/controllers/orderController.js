const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Only Customers can place an order)
const createOrder = async (req, res) => {
    const { customer, items, tailoringService, totalPrice, paymentStatus, shippingAddress } = req.body;

    try {
        const newOrder = new Order({
            customer,
            items,
            tailoringService,
            totalPrice,
            paymentStatus,
            shippingAddress,
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully!', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get all orders for a customer
// @route   GET /api/orders/customer/:customerId
// @access  Private (Only Customers can view their orders)
const getOrdersByCustomer = async (req, res) => {
    const { customerId } = req.params;

    try {
        const orders = await Order.find({ customer: customerId }).populate('customer', 'name email');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get all orders for a tailor
// @route   GET /api/orders/tailor/:tailorId
// @access  Private (Only Tailors can view their orders)
const getOrdersByTailor = async (req, res) => {
    const { tailorId } = req.params;

    try {
        const orders = await Order.find({ 'tailoringService.tailor': tailorId }).populate('customer', 'name email');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get all orders for a seller
// @route   GET /api/orders/seller/:sellerId
// @access  Private (Only Sellers can view orders related to their products)
const getOrdersBySeller = async (req, res) => {
    const { sellerId } = req.params;

    try {
        const orders = await Order.find({ 'items.fabric.seller': sellerId }).populate('customer', 'name email');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get a specific order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id)
            .populate('customer', 'name email')
            .populate('items.fabric', 'name price')
            .populate('tailoringService.tailor', 'name experience');

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Update the order status
// @route   PUT /api/orders/:id/status
// @access  Private (Only Admin can update order status)
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        order.status = status || order.status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully!', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Delete an order by ID
// @route   DELETE /api/orders/:id
// @access  Private (Only Admin can delete an order)
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        await order.remove();

        res.status(200).json({ message: 'Order deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { createOrder, getOrdersByCustomer, getOrdersByTailor, getOrdersBySeller, getOrderById, updateOrderStatus, deleteOrder };
