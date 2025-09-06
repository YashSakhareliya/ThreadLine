import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Fabric from '../models/Fabric.js';
import { validationResult } from 'express-validator';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    // Build query
    let query = { customer: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.fabric', 'name image price shop')
      .populate('items.fabric.shop', 'name city')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.fabric', 'name image price shop')
      .populate('items.fabric.shop', 'name city phone email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order or is admin
    if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req, res) => {
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

    const { items, shippingAddress, paymentMethod, shippingMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Validate and calculate order totals
    let orderItems = [];
    let subtotal = 0;

    for (let item of items) {
      const fabric = await Fabric.findById(item.fabricId);
      
      if (!fabric) {
        return res.status(404).json({
          success: false,
          message: `Fabric with id ${item.fabricId} not found`
        });
      }

      if (fabric.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${fabric.name}. Available: ${fabric.stock}, Requested: ${item.quantity}`
        });
      }

      const itemSubtotal = fabric.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        fabric: fabric._id,
        fabricId: fabric._id,
        quantity: item.quantity,
        price: fabric.price,
        subtotal: itemSubtotal
      });

      // Update fabric stock and purchase count
      fabric.stock -= item.quantity;
      fabric.totalPurchases += item.quantity;
      await fabric.save();
    }

    // Calculate shipping cost
    const shippingCost = shippingMethod === 'Express Delivery' ? 100 : 
                        shippingMethod === 'Same Day Delivery' ? 200 : 100;

    // Calculate tax (18% GST)
    const tax = Math.round(subtotal * 0.18);

    const total = subtotal + shippingCost + tax;

    // Calculate estimated delivery date
    const deliveryDays = shippingMethod === 'Express Delivery' ? 2 : 
                        shippingMethod === 'Same Day Delivery' ? 0 : 5;
    const estimatedDelivery = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000);

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      customerId: req.user.id,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      estimatedDelivery,
      shippingDetails: {
        method: shippingMethod || 'Standard Delivery',
        cost: shippingCost
      }
    });

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [], totalItems: 0, totalAmount: 0 } }
    );

    // Populate order for response
    await order.populate('items.fabric', 'name image price shop');

    // Send order confirmation email (async, don't wait for it)
    sendOrderConfirmationEmail(req.user.email, req.user.name, order).catch(err => 
      console.error('Failed to send order confirmation email:', err)
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Admin or Shop owner)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only admin or shop owners can update order status
    if (req.user.role !== 'admin' && req.user.role !== 'shop') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update order status'
      });
    }

    order.status = status;

    // Set delivery date if status is delivered
    if (status === 'Delivered') {
      order.deliveryDate = new Date();
    }

    // Generate tracking number if status is shipped
    if (status === 'Shipped' && !order.trackingNumber) {
      order.trackingNumber = 'TL' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
      order.shippingDetails.trackingUrl = `https://threadline.com/track/${order.trackingNumber}`;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id).populate('items.fabric');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order
    if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending or confirmed orders
    if (!['Pending', 'Confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status'
      });
    }

    // Restore fabric stock
    for (let item of order.items) {
      const fabric = await Fabric.findById(item.fabric._id);
      if (fabric) {
        fabric.stock += item.quantity;
        fabric.totalPurchases -= item.quantity;
        await fabric.save();
      }
    }

    order.status = 'Cancelled';
    order.cancelReason = reason;
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get shop orders
// @route   GET /api/v1/shops/:shopId/orders
// @access  Private (Shop owner only)
export const getShopOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
    const shopId = req.params.id; // Use 'id' instead of 'shopId' to match route parameter

    // Convert shopId to ObjectId for proper MongoDB comparison
    const mongoose = await import('mongoose');
    const shopObjectId = new mongoose.default.Types.ObjectId(shopId);

    // Aggregate to get orders that contain fabrics from this shop
    const orders = await Order.aggregate([
      // First, lookup fabric details for each item
      {
        $lookup: {
          from: 'fabrics',
          localField: 'items.fabric',
          foreignField: '_id',
          as: 'fabricDetails'
        }
      },
      // Filter orders that have fabrics from this shop
      {
        $match: {
          'fabricDetails.shop': shopObjectId
        }
      },
      // Add status filter if provided
      ...(status ? [{ $match: { status } }] : []),
      // Sort
      { $sort: { [sortBy]: -1 } },
      // Pagination
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      // Lookup customer details
      {
        $lookup: {
          from: 'users',
          localField: 'customer',
          foreignField: '_id',
          as: 'customerDetails'
        }
      },
      // Project only needed fields
      {
        $project: {
          _id: 1,
          customer: { $arrayElemAt: ['$customerDetails.name', 0] },
          customerEmail: { $arrayElemAt: ['$customerDetails.email', 0] },
          items: 1,
          total: 1,
          status: 1,
          createdAt: 1,
          shippingAddress: 1,
          trackingNumber: 1
        }
      }
    ]);

    // Get total count
    const totalResult = await Order.aggregate([
      {
        $lookup: {
          from: 'fabrics',
          localField: 'items.fabric',
          foreignField: '_id',
          as: 'fabricDetails'
        }
      },
      {
        $match: {
          'fabricDetails.shop': shopObjectId,
          ...(status ? { status } : {})
        }
      },
      { $count: 'total' }
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    res.json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
