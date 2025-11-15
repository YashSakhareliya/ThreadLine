import Shop from '../models/Shop.js';
import Fabric from '../models/Fabric.js';

/**
 * Calculate and update shop rating based on all fabric reviews
 * @param {String} shopId - The shop ID
 * @returns {Object} Updated shop rating and total reviews
 */
export const updateShopRating = async (shopId) => {
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new Error('Shop not found');
    }

    // Get all active fabrics for this shop that have reviews
    const shopFabrics = await Fabric.find({ 
      shop: shopId, 
      isActive: true,
      'reviews.0': { $exists: true } // Only fabrics with at least one review
    });

    // Calculate total reviews across all fabrics
    let totalReviews = 0;
    let totalRating = 0;

    shopFabrics.forEach(fabric => {
      totalReviews += fabric.reviews.length;
      // Calculate average rating for this fabric
      const fabricAvgRating = fabric.reviews.reduce((sum, review) => sum + review.rating, 0) / fabric.reviews.length;
      totalRating += fabricAvgRating;
    });

    // Update shop with new values
    shop.totalReviews = totalReviews;
    shop.rating = shopFabrics.length > 0 
      ? Number((totalRating / shopFabrics.length).toFixed(2)) 
      : 0;

    await shop.save();

    return {
      totalReviews: shop.totalReviews,
      rating: shop.rating
    };
  } catch (error) {
    console.error('Update shop rating error:', error);
    throw error;
  }
};

/**
 * Recalculate ratings for all shops
 * Useful for data migration or fixing inconsistencies
 * @returns {Object} Summary of updated shops
 */
export const recalculateAllShopRatings = async () => {
  try {
    const shops = await Shop.find({ isActive: true });
    const results = {
      updated: 0,
      failed: 0,
      errors: []
    };

    for (const shop of shops) {
      try {
        await updateShopRating(shop._id);
        results.updated++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          shopId: shop._id,
          shopName: shop.name,
          error: error.message
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Recalculate all shop ratings error:', error);
    throw error;
  }
};
