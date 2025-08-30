import Customer from '../models/Customer.js';
import Shop from '../models/Shop.js';
import Tailor from '../models/Tailor.js';
import Order from '../models/Order.js';
import { validationResult } from 'express-validator';

// @desc    Get customer profile by user ID
// @route   GET /api/v1/customers/profile
// @access  Private
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ owner: req.user.id })
      .populate('favoriteShops', 'name image city rating')
      .populate('favoriteTailors', 'name image city rating specialization');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update customer profile
// @route   PUT /api/v1/customers/profile
// @access  Private
export const updateCustomerProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const customer = await Customer.findOneAndUpdate(
      { owner: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add address to customer profile
// @route   POST /api/v1/customers/addresses
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const customer = await Customer.findOne({ owner: req.user.id });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    // If this is the first address or isDefault is true, make it default
    if (customer.addresses.length === 0 || req.body.isDefault) {
      // Remove default from other addresses
      customer.addresses.forEach(addr => addr.isDefault = false);
      req.body.isDefault = true;
    }

    customer.addresses.push(req.body);
    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: customer
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update address
// @route   PUT /api/v1/customers/addresses/:addressId
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const customer = await Customer.findOne({ owner: req.user.id });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const address = customer.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, remove default from others
    if (req.body.isDefault) {
      customer.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, req.body);
    await customer.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/v1/customers/addresses/:addressId
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const customer = await Customer.findOne({ owner: req.user.id });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const address = customer.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const wasDefault = address.isDefault;
    customer.addresses.pull(req.params.addressId);

    // If deleted address was default, make first remaining address default
    if (wasDefault && customer.addresses.length > 0) {
      customer.addresses[0].isDefault = true;
    }

    await customer.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: customer
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add shop to favorites
// @route   POST /api/v1/customers/favorites/shops/:shopId
// @access  Private
export const addFavoriteShop = async (req, res) => {
  try {
    const customer = await Customer.findOne({ owner: req.user.id });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const shop = await Shop.findById(req.params.shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (customer.favoriteShops.includes(req.params.shopId)) {
      return res.status(400).json({
        success: false,
        message: 'Shop already in favorites'
      });
    }

    customer.favoriteShops.push(req.params.shopId);
    await customer.save();

    res.json({
      success: true,
      message: 'Shop added to favorites',
      data: customer
    });
  } catch (error) {
    console.error('Add favorite shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove shop from favorites
// @route   DELETE /api/v1/customers/favorites/shops/:shopId
// @access  Private
export const removeFavoriteShop = async (req, res) => {
  try {
    const customer = await Customer.findOne({ owner: req.user.id });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    customer.favoriteShops.pull(req.params.shopId);
    await customer.save();

    res.json({
      success: true,
      message: 'Shop removed from favorites',
      data: customer
    });
  } catch (error) {
    console.error('Remove favorite shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add tailor to favorites
// @route   POST /api/v1/customers/favorites/tailors/:tailorId
// @access  Private
export const addFavoriteTailor = async (req, res) => {
  try {
    const customer = await Customer.findOne({ owner: req.user.id });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const tailor = await Tailor.findById(req.params.tailorId);
    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      });
    }

    if (customer.favoriteTailors.includes(req.params.tailorId)) {
      return res.status(400).json({
        success: false,
        message: 'Tailor already in favorites'
      });
    }

    customer.favoriteTailors.push(req.params.tailorId);
    await customer.save();

    res.json({
      success: true,
      message: 'Tailor added to favorites',
      data: customer
    });
  } catch (error) {
    console.error('Add favorite tailor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove tailor from favorites
// @route   DELETE /api/v1/customers/favorites/tailors/:tailorId
// @access  Private
export const removeFavoriteTailor = async (req, res) => {
  try {
    const customer = await Customer.findOne({ owner: req.user.id });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    customer.favoriteTailors.pull(req.params.tailorId);
    await customer.save();

    res.json({
      success: true,
      message: 'Tailor removed from favorites',
      data: customer
    });
  } catch (error) {
    console.error('Remove favorite tailor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get customer dashboard stats
// @route   GET /api/v1/customers/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const customer = await Customer.findOne({ owner: req.user.id })
      .populate('favoriteShops', 'name image city rating')
      .populate('favoriteTailors', 'name image city rating specialization');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    // Get recent orders
    const recentOrders = await Order.find({ customer: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.fabric', 'name image price');

    // Calculate stats
    const totalOrders = await Order.countDocuments({ customer: req.user.id });
    const totalSpent = await Order.aggregate([
      { $match: { customer: req.user.id, paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const stats = {
      totalOrders,
      favoriteShops: customer.favoriteShops.length,
      favoriteTailors: customer.favoriteTailors.length,
      totalSpent: totalSpent[0]?.total || 0,
      loyaltyPoints: customer.loyaltyPoints
    };

    res.json({
      success: true,
      data: {
        customer,
        stats,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
