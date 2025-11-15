import Fabric from '../models/Fabric.js';
import Shop from '../models/Shop.js';
import { validationResult } from 'express-validator';
import { updateShopRating } from '../utils/shopUtils.js';

// @desc    Get all fabrics
// @route   GET /api/v1/fabrics
// @access  Public
export const getAllFabrics = async (req, res) => {
  try {
    const { 
      category, 
      color, 
      material, 
      minPrice, 
      maxPrice, 
      search,
      city,
      sortBy = 'createdAt', 
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    // Handle city filter - fabrics don't have city, but shops do
    if (city) {
      const shopsInCity = await Shop.find({ 
        city: { $regex: city, $options: 'i' } 
      }).select('_id');
      const shopIds = shopsInCity.map(shop => shop._id);
      query.shop = { $in: shopIds };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (color) {
      query.color = { $regex: color, $options: 'i' };
    }
    
    if (material) {
      query.material = { $regex: material, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const fabrics = await Fabric.find(query)
      .populate('shop', 'name city rating')
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
    console.error('Get all fabrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single fabric
// @route   GET /api/v1/fabrics/:id
// @access  Public
export const getFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id)
      .populate('shop', 'name city rating phone email address')
      .populate('reviews.user', 'name avatar');

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    res.json({
      success: true,
      data: fabric
    });
  } catch (error) {
    console.error('Get fabric error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new fabric
// @route   POST /api/v1/shops/:shopId/fabrics
// @access  Private (Shop owners only)
export const createFabric = async (req, res) => {
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

    // Check if shop exists and user owns it
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to add fabrics to this shop'
      });
    }

    // Add shop to req.body
    req.body.shop = req.params.shopId;

    const fabric = await Fabric.create(req.body);
    await fabric.populate('shop', 'name city rating');

    res.status(201).json({
      success: true,
      message: 'Fabric created successfully',
      data: fabric
    });
  } catch (error) {
    console.error('Create fabric error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update fabric
// @route   PUT /api/v1/fabrics/:id
// @access  Private (Shop owner only)
export const updateFabric = async (req, res) => {
  try {
    let fabric = await Fabric.findById(req.params.id).populate('shop');

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    // Make sure user is shop owner
    if (fabric.shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this fabric'
      });
    }

    fabric = await Fabric.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('shop', 'name city rating');

    res.json({
      success: true,
      message: 'Fabric updated successfully',
      data: fabric
    });
  } catch (error) {
    console.error('Update fabric error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete fabric
// @route   DELETE /api/v1/fabrics/:id
// @access  Private (Shop owner only)
export const deleteFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id).populate('shop');

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    // Make sure user is shop owner
    if (fabric.shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this fabric'
      });
    }

    // Soft delete - just mark as inactive
    fabric.isActive = false;
    await fabric.save();

    res.json({
      success: true,
      message: 'Fabric deleted successfully'
    });
  } catch (error) {
    console.error('Delete fabric error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add fabric review
// @route   POST /api/v1/fabrics/:id/reviews
// @access  Private
export const addFabricReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    const fabric = await Fabric.findById(req.params.id);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: 'Fabric not found'
      });
    }

    // Check if user already reviewed this fabric
    const alreadyReviewed = fabric.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this fabric'
      });
    }

    const review = {
      user: req.user.id,
      customerName: req.user.name,
      rating: Number(rating),
      comment,
      images: images || []
    };

    fabric.reviews.push(review);

    // Update fabric rating
    fabric.ratings = fabric.reviews.reduce((acc, item) => item.rating + acc, 0) / fabric.reviews.length;

    await fabric.save();

    // Update shop total reviews count and shop rating using utility function
    try {
      await updateShopRating(fabric.shop);
    } catch (error) {
      console.error('Error updating shop rating:', error);
      // Continue even if shop rating update fails
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
