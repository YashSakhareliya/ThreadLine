import Fabric from '../models/Fabric.js';
import Shop from '../models/Shop.js';
import Tailor from '../models/Tailor.js';

// @desc    Global search across fabrics, shops, and tailors
// @route   GET /api/v1/search?q=query&type=all|fabrics|shops|tailors
// @access  Public
export const globalSearch = async (req, res) => {
  try {
    const { q: query, type = 'all', page = 1, limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchResults = {};
    const searchRegex = { $regex: query, $options: 'i' };

    // Search fabrics
    if (type === 'all' || type === 'fabrics') {
      const fabrics = await Fabric.find({
        isActive: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { color: searchRegex },
          { material: searchRegex }
        ]
      })
      .populate('shop', 'name city rating')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ totalPurchases: -1 });

      searchResults.fabrics = {
        count: fabrics.length,
        data: fabrics
      };
    }

    // Search shops
    if (type === 'all' || type === 'shops') {
      const shops = await Shop.find({
        isActive: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { city: searchRegex }
        ]
      })
      .populate('owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

      searchResults.shops = {
        count: shops.length,
        data: shops
      };
    }

    // Search tailors
    if (type === 'all' || type === 'tailors') {
      const tailors = await Tailor.find({
        isActive: true,
        $or: [
          { name: searchRegex },
          { bio: searchRegex },
          { city: searchRegex },
          { specialization: { $in: [searchRegex] } }
        ]
      })
      .populate('owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

      searchResults.tailors = {
        count: tailors.length,
        data: tailors
      };
    }

    res.json({
      success: true,
      query,
      type,
      results: searchResults
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};

// @desc    Get search suggestions
// @route   GET /api/v1/search/suggestions?q=query
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const searchRegex = { $regex: query, $options: 'i' };

    // Get fabric suggestions
    const fabricSuggestions = await Fabric.find({
      isActive: true,
      name: searchRegex
    })
    .select('name category')
    .limit(5);

    // Get shop suggestions
    const shopSuggestions = await Shop.find({
      isActive: true,
      name: searchRegex
    })
    .select('name city')
    .limit(5);

    // Get category suggestions
    const categories = await Fabric.distinct('category', {
      category: searchRegex,
      isActive: true
    });

    const suggestions = [
      ...fabricSuggestions.map(f => ({ type: 'fabric', text: f.name, category: f.category })),
      ...shopSuggestions.map(s => ({ type: 'shop', text: s.name, city: s.city })),
      ...categories.map(c => ({ type: 'category', text: c }))
    ];

    res.json({
      success: true,
      suggestions: suggestions.slice(0, 10)
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Location-aware search with filtering
// @route   GET /api/v1/search/nearby
// @access  Public
export const nearbySearch = async (req, res) => {
  try {
    const { 
      q: query, 
      type = 'all', 
      city, 
      state,
      category,
      material,
      minRating = 0,
      maxPrice,
      minPrice,
      page = 1, 
      limit = 20 
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchResults = {};
    const searchRegex = { $regex: query, $options: 'i' };

    // Search fabrics with location and filters
    if (type === 'all' || type === 'fabrics') {
      let fabricQuery = {
        isActive: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { color: searchRegex },
          { material: searchRegex }
        ]
      };

      // Add filters
      if (category) fabricQuery.category = { $regex: category, $options: 'i' };
      if (material) fabricQuery.material = { $regex: material, $options: 'i' };
      if (minPrice) fabricQuery.price = { ...fabricQuery.price, $gte: parseFloat(minPrice) };
      if (maxPrice) fabricQuery.price = { ...fabricQuery.price, $lte: parseFloat(maxPrice) };

      const fabrics = await Fabric.find(fabricQuery)
        .populate({
          path: 'shop',
          select: 'name city state rating',
          match: {
            ...(city && { city: { $regex: city, $options: 'i' } }),
            ...(state && { state: { $regex: state, $options: 'i' } }),
            ...(minRating && { rating: { $gte: parseFloat(minRating) } })
          }
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ totalPurchases: -1 });

      // Filter out fabrics whose shops don't match location criteria
      const filteredFabrics = fabrics.filter(fabric => fabric.shop);

      searchResults.fabrics = {
        count: filteredFabrics.length,
        data: filteredFabrics
      };
    }

    // Search shops with location filters
    if (type === 'all' || type === 'shops') {
      let shopQuery = {
        isActive: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      };

      // Add location filters
      if (city) shopQuery.city = { $regex: city, $options: 'i' };
      if (state) shopQuery.state = { $regex: state, $options: 'i' };
      if (minRating) shopQuery.rating = { $gte: parseFloat(minRating) };

      const shops = await Shop.find(shopQuery)
        .populate('owner', 'name email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ rating: -1 });

      searchResults.shops = {
        count: shops.length,
        data: shops
      };
    }

    // Search tailors with location and specialization filters
    if (type === 'all' || type === 'tailors') {
      let tailorQuery = {
        isActive: true,
        $or: [
          { name: searchRegex },
          { bio: searchRegex },
          { specialization: { $in: [searchRegex] } }
        ]
      };

      // Add location filters
      if (city) tailorQuery.city = { $regex: city, $options: 'i' };
      if (minRating) tailorQuery.rating = { $gte: parseFloat(minRating) };

      const tailors = await Tailor.find(tailorQuery)
        .populate('owner', 'name email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ rating: -1 });

      searchResults.tailors = {
        count: tailors.length,
        data: tailors
      };
    }

    res.json({
      success: true,
      query,
      type,
      filters: { city, state, category, material, minRating },
      results: searchResults
    });
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};
