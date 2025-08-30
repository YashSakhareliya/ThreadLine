import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Fabric from '../models/Fabric.js';
import Order from '../models/Order.js';
import Tailor from '../models/Tailor.js';

// Get dashboard analytics
export const getDashboardAnalytics = async () => {
  try {
    const [
      totalUsers,
      totalShops,
      totalFabrics,
      totalOrders,
      totalTailors,
      recentOrders,
      topFabrics,
      monthlyRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments({ isActive: true }),
      Fabric.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Tailor.countDocuments({ isActive: true }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name email'),
      Fabric.find({ isActive: true }).sort({ totalPurchases: -1 }).limit(5),
      getMonthlyRevenue()
    ]);

    return {
      totalUsers,
      totalShops,
      totalFabrics,
      totalOrders,
      totalTailors,
      recentOrders,
      topFabrics,
      monthlyRevenue
    };
  } catch (error) {
    console.error('Analytics error:', error);
    throw error;
  }
};

// Get monthly revenue
const getMonthlyRevenue = async () => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['Delivered', 'Shipped', 'Processing'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    return monthlyOrders[0] || { totalRevenue: 0, totalOrders: 0 };
  } catch (error) {
    console.error('Monthly revenue error:', error);
    return { totalRevenue: 0, totalOrders: 0 };
  }
};

// Get shop analytics
export const getShopAnalytics = async (shopId) => {
  try {
    const [
      totalFabrics,
      totalOrders,
      totalRevenue,
      avgRating,
      recentOrders,
      topFabrics
    ] = await Promise.all([
      Fabric.countDocuments({ shop: shopId, isActive: true }),
      Order.countDocuments({ 'items.fabric': { $in: await Fabric.find({ shop: shopId }).select('_id') } }),
      getShopRevenue(shopId),
      Shop.findById(shopId).select('rating'),
      getShopRecentOrders(shopId),
      Fabric.find({ shop: shopId, isActive: true }).sort({ totalPurchases: -1 }).limit(5)
    ]);

    return {
      totalFabrics,
      totalOrders,
      totalRevenue: totalRevenue.totalRevenue || 0,
      avgRating: avgRating?.rating || 0,
      recentOrders,
      topFabrics
    };
  } catch (error) {
    console.error('Shop analytics error:', error);
    throw error;
  }
};

// Get shop revenue
const getShopRevenue = async (shopId) => {
  try {
    const shopFabrics = await Fabric.find({ shop: shopId }).select('_id');
    const fabricIds = shopFabrics.map(f => f._id);

    const revenue = await Order.aggregate([
      {
        $match: {
          'items.fabric': { $in: fabricIds },
          status: { $in: ['Delivered', 'Shipped', 'Processing'] }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $match: {
          'items.fabric': { $in: fabricIds }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$items.subtotal' }
        }
      }
    ]);

    return revenue[0] || { totalRevenue: 0 };
  } catch (error) {
    console.error('Shop revenue error:', error);
    return { totalRevenue: 0 };
  }
};

// Get shop recent orders
const getShopRecentOrders = async (shopId) => {
  try {
    const shopFabrics = await Fabric.find({ shop: shopId }).select('_id');
    const fabricIds = shopFabrics.map(f => f._id);

    const orders = await Order.find({
      'items.fabric': { $in: fabricIds }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('customer', 'name email')
    .populate('items.fabric', 'name price');

    return orders;
  } catch (error) {
    console.error('Shop recent orders error:', error);
    return [];
  }
};
