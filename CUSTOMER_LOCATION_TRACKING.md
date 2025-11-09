# Customer Location Tracking System - Implementation Documentation

## Overview
This document explains the customer location tracking system that automatically captures and stores customer geolocation data.

## Features Implemented

### 1. **Database Schema Updates**
- Added `latitude` and `longitude` fields to Customer model
- Added `location` field (GeoJSON Point format) for geospatial queries
- Added `lastLocationUpdate` timestamp
- Created 2dsphere index for efficient location-based queries

### 2. **Backend API**

#### New Endpoint
```
PUT /api/v1/customers/location
```

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

**Response**:
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "lastLocationUpdate": "2025-11-09T10:30:00.000Z"
  }
}
```

**Validation**:
- Latitude must be between -90 and 90
- Longitude must be between -180 and 180
- Both fields are required

### 3. **Frontend Implementation**

#### A. Custom Hook: `useCustomerLocation`
**Location**: `frontend/src/hooks/useCustomerLocation.js`

**Purpose**: Automatically tracks and updates customer location

**Behavior**:
- Runs on component mount (including page refresh)
- Only activates for authenticated customers
- Gets current location from browser
- Saves to backend via API
- Fails silently to avoid disrupting user experience

**Usage**:
```jsx
import useCustomerLocation from '../hooks/useCustomerLocation';

function MyComponent() {
  useCustomerLocation(); // Automatically updates location
  // ... rest of component
}
```

#### B. App-Level Integration
**Location**: `frontend/src/App.jsx`

The hook is called in `AppContent` component, ensuring location is updated on every page load/refresh for logged-in customers.

#### C. Enhanced Page Logic
**Updated Pages**:
- `AllShopsPage.jsx`
- `AllTailorsPage.jsx`

**Behavior**:
1. First attempts to use **saved customer location** from profile
2. Falls back to **current browser location** if no saved location
3. Falls back to **showing all items** without distance if no location available

**Priority Order**:
```
Saved Customer Location → Browser Location → No Location (show all)
```

### 4. **Service Layer**

#### customerService.js
Added new method:
```javascript
updateCustomerLocation(latitude, longitude)
```

## How It Works - Complete Flow

### On Page Load/Refresh:

```
1. User visits any page (authenticated as customer)
   ↓
2. useCustomerLocation hook activates
   ↓
3. Requests browser geolocation permission (if not granted)
   ↓
4. Gets GPS coordinates (lat, lon)
   ↓
5. Sends PUT request to /api/v1/customers/location
   ↓
6. Backend validates and saves to database
   ↓
7. Updates Customer document:
      - latitude: 19.0760
      - longitude: 72.8777
      - location: { type: 'Point', coordinates: [72.8777, 19.0760] }
      - lastLocationUpdate: <current timestamp>
   ↓
8. Location is now stored in database
```

### When Viewing Shops/Tailors:

```
1. User navigates to AllShopsPage/AllTailorsPage
   ↓
2. Page loads and attempts to get location:
   ↓
   A. Fetch customer profile from backend
      ↓
      If customer has saved latitude/longitude:
         → Use saved location ✓ (Most reliable)
      ↓
   B. Otherwise, request current browser location
      ↓
      If browser provides location:
         → Use current location ✓
      ↓
   C. Otherwise:
         → Show all items without distance
   ↓
3. Send location to backend API:
   GET /api/v1/shops/nearby?userLat=19.0760&userLon=72.8777
   ↓
4. Backend calculates distances using Haversine formula
   ↓
5. Returns shops/tailors sorted by distance
   ↓
6. Frontend displays with distance: "2.3 km away"
```

## Customer Model Schema

```javascript
{
  // ... existing fields ...
  
  // Location fields
  latitude: {
    type: Number,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  lastLocationUpdate: {
    type: Date
  }
}
```

## Privacy & User Experience Considerations

### 1. **Permission Based**
- Requires user's explicit browser permission
- Users can deny location access
- System gracefully handles denied permissions

### 2. **Silent Failures**
- Location update failures don't disrupt user experience
- Errors are logged to console for debugging
- Users can still browse without location

### 3. **Automatic Updates**
- Location updates on every page load/refresh
- Keeps customer location data fresh
- Useful for tracking customer movement patterns

### 4. **Performance**
- Uses 10-minute cache for browser geolocation
- Reduces repeated GPS queries
- Efficient 2dsphere indexing for database queries

## API Testing

### Update Customer Location
```bash
# Login first to get token
POST http://localhost:5000/api/v1/auth/login
{
  "email": "customer@example.com",
  "password": "password123"
}

# Update location
PUT http://localhost:5000/api/v1/customers/location
Headers: {
  "Authorization": "Bearer <your-token>"
}
Body: {
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

### Get Customer Profile (verify location)
```bash
GET http://localhost:5000/api/v1/customers/profile
Headers: {
  "Authorization": "Bearer <your-token>"
}

# Response will include:
{
  "data": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "lastLocationUpdate": "2025-11-09T10:30:00.000Z",
    // ... other fields
  }
}
```

## Database Queries

### Find Customers Near a Location
```javascript
const nearbyCustomers = await Customer.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [72.8777, 19.0760] // [lng, lat]
      },
      $maxDistance: 5000 // 5km in meters
    }
  }
});
```

### Get All Customer Locations
```javascript
const customersWithLocation = await Customer.find({
  latitude: { $exists: true },
  longitude: { $exists: true }
});
```

## Future Enhancements

1. **Location History**: Track customer movement over time
2. **Geofencing**: Notify when customer enters specific areas
3. **Location-Based Offers**: Special deals for nearby customers
4. **Analytics**: Customer density heatmaps
5. **Manual Override**: Allow customers to set preferred location
6. **Location Accuracy**: Store GPS accuracy metadata

## Security Considerations

1. **Authentication Required**: Only logged-in customers can update location
2. **Input Validation**: Strict coordinate validation
3. **Rate Limiting**: Consider adding rate limits to prevent abuse
4. **Privacy Policy**: Ensure users are informed about location tracking
5. **Data Retention**: Consider implementing location data cleanup policy

## Troubleshooting

### Location Not Updating
1. Check browser console for errors
2. Verify user granted location permission
3. Check network tab for failed API calls
4. Verify JWT token is valid
5. Check MongoDB connection

### Distance Not Showing
1. Verify customer has location saved in profile
2. Check if shops/tailors have location coordinates
3. Verify API is receiving userLat/userLon parameters
4. Check backend logs for calculation errors

### Performance Issues
1. Ensure 2dsphere index is created: `db.customers.getIndexes()`
2. Monitor query performance with `.explain()`
3. Consider pagination for large datasets
4. Add caching layer for frequently accessed data

## Files Modified

### Backend
- `backend/models/Customer.js` - Added location fields
- `backend/controllers/customerController.js` - Added updateCustomerLocation
- `backend/routes/customers.js` - Added location route

### Frontend
- `frontend/src/services/customerService.js` - Added updateCustomerLocation
- `frontend/src/hooks/useCustomerLocation.js` - New custom hook
- `frontend/src/App.jsx` - Integrated location tracking
- `frontend/src/pages/AllShopsPage.jsx` - Use saved location
- `frontend/src/pages/AllTailorsPage.jsx` - Use saved location

---

**Implementation Date**: November 9, 2025  
**Status**: ✅ Complete and Ready for Testing
