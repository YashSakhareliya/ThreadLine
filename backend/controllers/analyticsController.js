import { getDashboardAnalytics, getShopAnalytics } from '../utils/analytics.js';

// @desc    Get dashboard analytics
// @route   GET /api/v1/analytics/dashboard
// @access  Private (Admin only)
export const getDashboard = async (req, res) => {
  try {
    const analytics = await getDashboardAnalytics();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get shop analytics
// @route   GET /api/v1/analytics/shop/:shopId
// @access  Private (Shop owner or Admin)
export const getShopDashboard = async (req, res) => {
  try {
    const { shopId } = req.params;
    const analytics = await getShopAnalytics(shopId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get shop analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
