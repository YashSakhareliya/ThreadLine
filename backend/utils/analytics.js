import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Fabric from '../models/Fabric.js';
import Tailor from '../models/Tailor.js';

// Get dashboard analytics
export const getDashboardAnalytics = async () => {
  try {
    const [
      totalUsers,
      totalShops,
      totalFabrics,
      totalTailors,
      topFabrics
    ] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments({ isActive: true }),
      Fabric.countDocuments({ isActive: true }),
      Tailor.countDocuments({ isActive: true }),
      Fabric.find({ isActive: true }).sort({ likes: -1 }).limit(5)
    ]);

    return {
      totalUsers,
      totalShops,
      totalFabrics,
      totalTailors,
      topFabrics
    };
  } catch (error) {
    console.error('Analytics error:', error);
    throw error;
  }
};

// Get shop analytics
export const getShopAnalytics = async (shopId) => {
  try {
    const [
      totalFabrics,
      avgRating,
      topFabrics
    ] = await Promise.all([
      Fabric.countDocuments({ shop: shopId, isActive: true }),
      Shop.findById(shopId).select('rating'),
      Fabric.find({ shop: shopId, isActive: true }).sort({ likes: -1 }).limit(5)
    ]);

    return {
      totalFabrics,
      avgRating: avgRating?.rating || 0,
      topFabrics
    };
  } catch (error) {
    console.error('Shop analytics error:', error);
    throw error;
  }
};
