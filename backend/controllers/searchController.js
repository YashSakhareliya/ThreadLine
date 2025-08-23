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
