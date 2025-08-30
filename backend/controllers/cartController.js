import Cart from '../models/Cart.js';
import Fabric from '../models/Fabric.js';
import { validationResult } from 'express-validator';

// @desc    Get user cart
// @route   GET /api/v1/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.fabric', 'name image price stock shop category color')
      .populate('items.fabric.shop', 'name city');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fabricId, quantity = 1 } = req.body;

    // Check if fabric exists and is available
    const fabric = await Fabric.findById(fabricId);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    if (!fabric.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Fabric is not available'
      });
    }

    if (fabric.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${fabric.stock}`
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.fabric.toString() === fabricId
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > fabric.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Total would exceed available stock (${fabric.stock})`
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].subtotal = fabric.price * newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        fabric: fabricId,
        fabricId: fabricId,
        quantity,
        price: fabric.price,
        subtotal: fabric.price * quantity
      });
    }

    await cart.save();
    await cart.populate('items.fabric', 'name image price stock shop category color');
    await cart.populate('items.fabric.shop', 'name city');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/update/:fabricId
// @access  Private
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { fabricId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check fabric availability
    const fabric = await Fabric.findById(fabricId);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    if (quantity > fabric.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${fabric.stock}`
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.fabric.toString() === fabricId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update item
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].subtotal = fabric.price * quantity;

    await cart.save();
    await cart.populate('items.fabric', 'name image price stock shop category color');
    await cart.populate('items.fabric.shop', 'name city');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/remove/:fabricId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { fabricId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      item => item.fabric.toString() !== fabricId
    );

    await cart.save();
    await cart.populate('items.fabric', 'name image price stock shop category color');
    await cart.populate('items.fabric.shop', 'name city');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/v1/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
