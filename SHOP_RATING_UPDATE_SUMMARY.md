# Shop Rating Auto-Update Feature - Implementation Summary

## Overview
Implemented automatic shop rating calculation when customers submit fabric reviews. The shop's rating is now calculated as the average of all fabric ratings, and the total review count is automatically updated.

## Changes Made

### 1. Backend Utility Functions (`backend/utils/shopUtils.js`) - NEW FILE
Created utility functions for shop rating management:

- **`updateShopRating(shopId)`**: 
  - Calculates shop rating as average of all fabric ratings
  - Updates shop's `totalReviews` count
  - Returns updated rating and total reviews

- **`recalculateAllShopRatings()`**:
  - Recalculates ratings for all active shops
  - Returns summary with success/failure counts
  - Useful for data maintenance and migrations

### 2. Fabric Controller Updates (`backend/controllers/fabricController.js`)
Modified `addFabricReview` function to:
- Add customer review to fabric
- Update fabric's average rating
- **Automatically call `updateShopRating()` to update shop's:**
  - Total reviews count (+1 for each review)
  - Average rating (calculated from all fabrics)

### 3. Shop Controller Updates (`backend/controllers/shopController.js`)
Added two new controller functions:

- **`recalculateShopRating(shopId)`**:
  - Manual recalculation for single shop
  - Accessible by shop owner or admin
  - Useful for fixing inconsistencies

- **`recalculateAllRatings()`**:
  - Bulk recalculation for all shops
  - Admin-only access
  - Returns detailed summary of operations

### 4. Shop Routes Updates (`backend/routes/shops.js`)
Added new API endpoints:

- `PUT /api/v1/shops/:id/recalculate-rating` (Shop Owner/Admin)
- `PUT /api/v1/shops/recalculate-all-ratings` (Admin Only)

### 5. API Documentation Updates (`BACKEND_API_DOCUMENTATION.md`)
Added documentation for:
- New shop rating endpoints
- Auto-update behavior when reviews are submitted
- Request/response examples

## How It Works

### Review Submission Flow
```
1. Customer submits review on fabric
   ↓
2. Review added to fabric.reviews array
   ↓
3. Fabric rating recalculated (average of all reviews)
   ↓
4. updateShopRating() called automatically
   ↓
5. Shop's totalReviews incremented
   ↓
6. Shop's rating recalculated (average of all fabric ratings)
   ↓
7. Shop document saved with new values
```

### Shop Rating Calculation Formula
```javascript
// For each fabric with reviews:
fabricRating = sum(all review ratings) / number of reviews

// For shop:
shopRating = sum(all fabric ratings) / number of fabrics with reviews
shopTotalReviews = sum(all review counts across all fabrics)
```

## API Usage Examples

### Automatic Update (No changes needed on frontend)
```javascript
// When customer submits review (existing endpoint)
POST /api/v1/fabrics/:fabricId/reviews
Authorization: Bearer <token>

{
  "rating": 5,
  "comment": "Excellent quality!",
  "images": []
}

// Shop rating is automatically updated in the background
```

### Manual Recalculation (If needed)
```javascript
// Recalculate single shop
PUT /api/v1/shops/:shopId/recalculate-rating
Authorization: Bearer <token>

// Response:
{
  "success": true,
  "message": "Shop rating recalculated successfully",
  "data": {
    "totalReviews": 45,
    "rating": 4.35
  }
}
```

### Admin Bulk Recalculation
```javascript
// Recalculate all shops (admin only)
PUT /api/v1/shops/recalculate-all-ratings
Authorization: Bearer <admin-token>

// Response:
{
  "success": true,
  "message": "All shop ratings recalculated successfully",
  "data": {
    "updated": 50,
    "failed": 0,
    "errors": []
  }
}
```

## Database Schema

### Shop Model Fields
```javascript
{
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}
```

### Fabric Model Fields
```javascript
{
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema]
}
```

## Benefits

1. **Automatic Updates**: No manual intervention needed
2. **Accurate Ratings**: Always reflects current review state
3. **Scalable**: Works with any number of fabrics/reviews
4. **Maintainable**: Centralized logic in utility functions
5. **Flexible**: Manual recalculation available when needed
6. **Consistent**: Same calculation logic across the platform

## Testing Recommendations

1. Test review submission updates shop rating correctly
2. Test multiple reviews on same fabric
3. Test multiple fabrics for same shop
4. Test edge cases (no reviews, all 5-star reviews, etc.)
5. Test manual recalculation endpoints
6. Test authorization (only shop owner/admin can recalculate)

## Future Enhancements

- Add review deletion functionality with automatic rating updates
- Add review editing functionality
- Implement weighted ratings (recent reviews count more)
- Add trending calculations based on recent reviews
- Send notifications to shop owners when ratings change significantly
