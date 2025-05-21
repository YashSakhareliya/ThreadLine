const Cart = require('../models/Cart.js');
const Fabric = require('../models/Fabric.js');
const Tailor = require('../models/Tailor.js');

// @desc    Add an item to the cart
// @route   POST /api/cart
// @access  Private (Only Customers can manage their carts)
const addItemToCart = async (req, res) => {
    const { customer, fabricId, quantity, tailorId, measurements, price } = req.body;

    try {
        // Check if the fabric exists
        const fabric = await Fabric.findById(fabricId);
        if (!fabric) {
            return res.status(404).json({ message: 'Fabric not found' });
        }

        // Create or update the cart
        let cart = await Cart.findOne({ customer });

        if (!cart) {
            // If no cart exists for the customer, create a new cart
            cart = new Cart({
                customer,
                items: [{ fabric: fabricId, quantity }],
                tailoringService: {
                    tailor: tailorId,
                    measurements,
                    price
                },
                totalPrice: fabric.price * quantity + price
            });
        } else {
            // If the cart exists, update it
            const existingItem = cart.items.find(item => item.fabric.toString() === fabricId);
            if (existingItem) {
                existingItem.quantity += quantity; // Increase quantity
            } else {
                cart.items.push({ fabric: fabricId, quantity });
            }

            // Update tailoring service
            cart.tailoringService.tailor = tailorId;
            cart.tailoringService.measurements = measurements;
            cart.tailoringService.price = price;

            // Recalculate total price
            cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * fabric.price), 0) + price;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Get the cart of a customer
// @route   GET /api/cart/:customerId
// @access  Private (Only Customers can view their cart)
const getCartByCustomer = async (req, res) => {
    const { customerId } = req.params;

    try {
        const cart = await Cart.findOne({ customer: customerId }).populate('items.fabric').populate('tailoringService.tailor');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/:cartId/item/:itemId
// @access  Private (Only Customers can remove items from their cart)
const removeItemFromCart = async (req, res) => {
    const { cartId, itemId } = req.params;

    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Update quantity of an item in the cart
// @route   PUT /api/cart/:cartId/item/:itemId
// @access  Private (Only Customers can update their cart items)
const updateItemQuantity = async (req, res) => {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item._id.toString() === itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;

        // Recalculate total price
        const totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.fabric.price), 0);
        cart.totalPrice = totalPrice;

        await cart.save();

        res.status(200).json({ message: 'Item quantity updated', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Clear the cart (remove all items)
// @route   DELETE /api/cart/:cartId
// @access  Private (Only Customers can clear their cart)
const clearCart = async (req, res) => {
    const { cartId } = req.params;

    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    addItemToCart,
    getCartByCustomer,
    removeItemFromCart,
    updateItemQuantity,
    clearCart
};

