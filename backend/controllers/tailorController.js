import Tailor from '../models/Tailor.js';
import { validationResult } from 'express-validator';
import { updateLocationData, extractCoordinates } from '../utils/locationUtils.js';

// @desc    Get all tailors
// @route   GET /api/v1/tailors
// @access  Public
export const getAllTailors = async (req, res) => {
  try {
    const { 
      city, 
      specialization, 
      minRating, 
      search, 
      sortBy = 'createdAt', 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    
    if (specialization) {
      query.specialization = { $in: [specialization] };
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const tailors = await Tailor.find(query)
      .populate('owner', 'name email')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tailor.countDocuments(query);

    res.json({
      success: true,
      count: tailors.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: tailors
    });
  } catch (error) {
    console.error('Get all tailors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single tailor
// @route   GET /api/v1/tailors/:id
// @access  Public
export const getTailor = async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('reviews.user', 'name avatar');

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      });
    }

    res.json({
      success: true,
      data: tailor
    });
  } catch (error) {
    console.error('Get tailor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new tailor profile
// @route   POST /api/v1/tailors
// @access  Private (Tailor role only)
export const createTailor = async (req, res) => {
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

    // Check if user already has a tailor profile
    const existingTailor = await Tailor.findOne({ owner: req.user.id });
    if (existingTailor) {
      return res.status(400).json({
        success: false,
        message: 'You already have a tailor profile'
      });
    }

    // Add user to req.body
    req.body.owner = req.user.id;

    // Process location data if provided
    const tailorData = await updateLocationData(req.body);
    // console.log('Creating tailor with data:', tailorData);

    const tailor = await Tailor.create(tailorData);

    res.status(201).json({
      success: true,
      message: 'Tailor profile created successfully',
      data: tailor
    });
  } catch (error) {
    console.error('Create tailor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update tailor profile
// @route   PUT /api/v1/tailors/:id
// @access  Private (Tailor owner only)
export const updateTailor = async (req, res) => {
  try {
    let tailor = await Tailor.findById(req.params.id);

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      });
    }

    // Make sure user is tailor owner
    if (tailor.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this tailor profile'
      });
    }

    // Process location data if provided
    const updateData = await updateLocationData(req.body);
    
    tailor = await Tailor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Tailor profile updated successfully',
      data: tailor
    });
  } catch (error) {
    console.error('Update tailor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete tailor profile
// @route   DELETE /api/v1/tailors/:id
// @access  Private (Tailor owner only)
export const deleteTailor = async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id);

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      });
    }

    // Make sure user is tailor owner
    if (tailor.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this tailor profile'
      });
    }

    // Soft delete - just mark as inactive
    tailor.isActive = false;
    await tailor.save();

    res.json({
      success: true,
      message: 'Tailor profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete tailor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add tailor review
// @route   POST /api/v1/tailors/:id/reviews
// @access  Private
export const addTailorReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    const tailor = await Tailor.findById(req.params.id);

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: 'Tailor not found'
      });
    }

    // Check if user already reviewed this tailor
    const alreadyReviewed = tailor.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tailor'
      });
    }

    const review = {
      user: req.user.id,
      customerName: req.user.name,
      rating: Number(rating),
      comment,
      images: images || []
    };

    tailor.reviews.push(review);
    tailor.totalReviews = tailor.reviews.length;

    // Update tailor rating
    tailor.rating = tailor.reviews.reduce((acc, item) => item.rating + acc, 0) / tailor.reviews.length;

    await tailor.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add tailor review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get tailors suitable for specific fabric
// @route   GET /api/v1/tailors/by-fabric
// @access  Public
export const getTailorsByFabric = async (req, res) => {
  try {
    const { 
      fabricType, 
      material, 
      category, 
      city, 
      userLat,
      userLon,
      limit = 6 
    } = req.query;

    if (!fabricType && !material && !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fabric type, material, or category'
      });
    }

    // Build query to find relevant tailors
    let query = { isActive: true };
    
    // Match tailors based on specialization that would work with the fabric
    const fabricSpecializationMap = {
      // Traditional fabrics
      'silk': ['Traditional Wear', 'Sarees', 'Lehengas', 'Blouses', 'Formal Wear'],
      'cotton': ['Casual Wear', 'Shirts', 'Traditional Wear', 'Sarees', 'Blouses'],
      'linen': ['Casual Wear', 'Shirts', 'Formal Wear'],
      'chiffon': ['Sarees', 'Lehengas', 'Blouses', 'Traditional Wear'],
      'georgette': ['Sarees', 'Lehengas', 'Blouses', 'Traditional Wear'],
      'velvet': ['Traditional Wear', 'Lehengas', 'Formal Wear'],
      'satin': ['Formal Wear', 'Traditional Wear', 'Lehengas', 'Blouses'],
      'crepe': ['Formal Wear', 'Casual Wear', 'Traditional Wear'],
      'wool': ['Suits', 'Formal Wear', 'Traditional Wear'],
      'polyester': ['Casual Wear', 'Formal Wear', 'Shirts'],
      'denim': ['Casual Wear', 'Alterations'],
      'khadi': ['Traditional Wear', 'Casual Wear'],
      
      // Fabric categories
      'traditional': ['Traditional Wear', 'Sarees', 'Lehengas', 'Blouses'],
      'formal': ['Suits', 'Formal Wear', 'Shirts'],
      'casual': ['Casual Wear', 'Shirts', 'Alterations'],
      'ethnic': ['Traditional Wear', 'Sarees', 'Lehengas', 'Blouses'],
      'western': ['Suits', 'Formal Wear', 'Casual Wear', 'Shirts']
    };

    let specializationFilter = [];
    
    // Check material-based specialization
    if (material) {
      const materialLower = material.toLowerCase();
      if (fabricSpecializationMap[materialLower]) {
        specializationFilter = [...specializationFilter, ...fabricSpecializationMap[materialLower]];
      }
    }
    
    // Check fabric type-based specialization
    if (fabricType) {
      const typeLower = fabricType.toLowerCase();
      if (fabricSpecializationMap[typeLower]) {
        specializationFilter = [...specializationFilter, ...fabricSpecializationMap[typeLower]];
      }
    }
    
    // Check category-based specialization
    if (category) {
      const categoryLower = category.toLowerCase();
      if (fabricSpecializationMap[categoryLower]) {
        specializationFilter = [...specializationFilter, ...fabricSpecializationMap[categoryLower]];
      }
    }
    
    // Remove duplicates
    specializationFilter = [...new Set(specializationFilter)];
    
    if (specializationFilter.length > 0) {
      query.specialization = { $in: specializationFilter };
    }
    
    // Filter by city if provided (check both main city and address.city)
    if (city) {
      query.$or = [
        ...query.$or || [],
        { city: { $regex: city, $options: 'i' } },
        { 'address.city': { $regex: city, $options: 'i' } }
      ];
    }

    // Find matching tailors
    let tailors = await Tailor.find(query)
      .populate('owner', 'name email')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(parseInt(limit));

    // Convert to plain objects for consistency
    tailors = tailors.map(tailor => tailor.toObject());

    res.json({
      success: true,
      count: tailors.length,
      data: tailors
    });

  } catch (error) {
    console.error('Error getting tailors by fabric:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get nearby tailors (distance calculation removed)
// @route   GET /api/v1/tailors/nearby
// @access  Public
export const getNearbyTailors = async (req, res) => {
  try {
    const { 
      city, 
      specialization, 
      minRating, 
      search, 
      sortBy = 'rating', 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (city) {
      query.$or = [
        { city: { $regex: city, $options: 'i' } },
        { 'address.city': { $regex: city, $options: 'i' } }
      ];
    }
    
    if (specialization) {
      query.specialization = { $in: [specialization] };
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Get tailors
    let tailors = await Tailor.find(query)
      .populate('owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Convert to plain objects and sort
    tailors = tailors.map(tailor => tailor.toObject());
    
    if (sortBy === 'rating') {
      tailors.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      tailors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = await Tailor.countDocuments(query);

    res.json({
      success: true,
      count: tailors.length,
      total,
      data: tailors
    });

  } catch (error) {
    console.error('Error getting nearby tailors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
