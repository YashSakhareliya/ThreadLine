import Shop from '../models/Shop.js';
import Fabric from '../models/Fabric.js';
import { validationResult } from 'express-validator';
import { updateLocationData, extractCoordinates } from '../utils/locationUtils.js';
import { updateShopRating, recalculateAllShopRatings } from '../utils/shopUtils.js';

// @desc    Get all shops
// @route   GET /api/v1/shops
// @access  Public
export const getAllShops = async (req, res) => {
  try {
    const { city, search, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const shops = await Shop.find(query)
      .populate('owner', 'name email')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Shop.countDocuments(query);

    res.json({
      success: true,
      count: shops.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: shops
    });
  } catch (error) {
    console.error('Get all shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single shop
// @route   GET /api/v1/shops/:id
// @access  Public
export const getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.json({
      success: true,
      data: shop
    });
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new shop
// @route   POST /api/v1/shops
// @access  Private (Shop owners only)
export const createShop = async (req, res) => {
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

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'You already have a shop registered'
      });
    }

    // Add user to req.body
    req.body.owner = req.user.id;

    // Process location data if provided
    const shopData = await updateLocationData(req.body);

    const shop = await Shop.create(shopData);

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update shop
// @route   PUT /api/v1/shops/:id
// @access  Private (Shop owner only)
export const updateShop = async (req, res) => {
  try {
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Make sure user is shop owner
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this shop'
      });
    }

    // Process location data if provided
    const updateData = await updateLocationData(req.body);
    
    shop = await Shop.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Shop updated successfully',
      data: shop
    });
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete shop
// @route   DELETE /api/v1/shops/:id
// @access  Private (Shop owner only)
export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Make sure user is shop owner
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this shop'
      });
    }

    // Soft delete - just mark as inactive
    shop.isActive = false;
    await shop.save();

    res.json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get shop fabrics
// @route   GET /api/v1/shops/:id/fabrics
// @access  Public
export const getShopFabrics = async (req, res) => {
  try {
    const { category, color, minPrice, maxPrice, sortBy = 'createdAt', page = 1, limit = 20 } = req.query;

    // Build query
    let query = { shop: req.params.id, isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (color) {
      query.color = { $regex: color, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const fabrics = await Fabric.find(query)
      .populate('shop', 'name city')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Fabric.countDocuments(query);

    res.json({
      success: true,
      count: fabrics.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: fabrics
    });
  } catch (error) {
    console.error('Get shop fabrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get nearby shops (distance calculation removed)
// @route   GET /api/v1/shops/nearby
// @access  Public
export const getNearbyShops = async (req, res) => {
  try {
    const { 
      city, 
      search, 
      minRating,
      sortBy = 'rating', 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Get shops
    let shops = await Shop.find(query)
      .populate('owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Sort shops
    shops = shops.map(shop => shop.toObject());
    
    if (sortBy === 'rating') {
      shops.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      shops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = await Shop.countDocuments(query);

    res.json({
      success: true,
      count: shops.length,
      total,
      data: shops
    });

  } catch (error) {
    console.error('Error getting nearby shops:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Recalculate shop rating based on fabric reviews
// @route   PUT /api/v1/shops/:id/recalculate-rating
// @access  Private (Shop owner or Admin)
export const recalculateShopRating = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check if user is shop owner or admin
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this shop'
      });
    }

    const result = await updateShopRating(req.params.id);

    res.json({
      success: true,
      message: 'Shop rating recalculated successfully',
      data: result
    });
  } catch (error) {
    console.error('Recalculate shop rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Recalculate all shop ratings (Admin only)
// @route   PUT /api/v1/shops/recalculate-all-ratings
// @access  Private (Admin only)
export const recalculateAllRatings = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin access required.'
      });
    }

    const result = await recalculateAllShopRatings();

    res.json({
      success: true,
      message: 'All shop ratings recalculated successfully',
      data: result
    });
  } catch (error) {
    console.error('Recalculate all ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
