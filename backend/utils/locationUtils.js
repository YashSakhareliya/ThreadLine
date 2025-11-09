/**
 * Enhanced location utilities for ThreadLine application
 * Handles geocoding, distance calculation, and location validation
 */

import { calculateDistance, getCityCoordinates } from './geolocation.js';

/**
 * Geocoding service using a free API (you can replace with Google Maps API)
 * For now using a mock function that tries to get coordinates from city name
 * @param {string} address - Full address string
 * @param {string} city - City name
 * @returns {Promise<{lat: number, lng: number}|null>}
 */
export const geocodeAddress = async (address, city) => {
  try {
    // First try to get coordinates from our city database
    const cityCoords = getCityCoordinates(city);
    if (cityCoords) {
      return {
        lat: cityCoords.lat,
        lng: cityCoords.lon
      };
    }

    // In a real implementation, you would call a geocoding API here
    // Example with Google Maps Geocoding API:
    // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', ' + city)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    // const data = await response.json();
    // if (data.results && data.results.length > 0) {
    //   const location = data.results[0].geometry.location;
    //   return { lat: location.lat, lng: location.lng };
    // }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

/**
 * Calculate distance between two points with coordinates
 * @param {number} lat1 
 * @param {number} lng1 
 * @param {number} lat2 
 * @param {number} lng2 
 * @returns {number} Distance in kilometers
 */
export const calculateDistanceBetweenCoordinates = (lat1, lng1, lat2, lng2) => {
  return calculateDistance(lat1, lng1, lat2, lng2);
};

/**
 * Validate coordinates
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {boolean}
 */
export const validateCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' && 
    typeof longitude === 'number' &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
};

/**
 * Create GeoJSON Point from coordinates
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {object} GeoJSON Point
 */
export const createGeoJSONPoint = (latitude, longitude) => {
  if (!validateCoordinates(latitude, longitude)) {
    return null;
  }
  
  return {
    type: 'Point',
    coordinates: [longitude, latitude] // GeoJSON uses [lng, lat] format
  };
};

/**
 * Extract coordinates from location data
 * @param {object} locationData - Can contain various location fields
 * @returns {object|null} {lat, lng} or null
 */
export const extractCoordinates = (locationData) => {
  // Check for direct lat/lng fields
  if (locationData.latitude && locationData.longitude) {
    return {
      lat: locationData.latitude,
      lng: locationData.longitude
    };
  }

  // Check for lat/lon fields
  if (locationData.lat && locationData.lon) {
    return {
      lat: locationData.lat,
      lng: locationData.lon
    };
  }

  // Check for GeoJSON format
  if (locationData.location && locationData.location.coordinates) {
    const [lng, lat] = locationData.location.coordinates;
    return { lat, lng };
  }

  return null;
};

/**
 * Find nearby items based on user location
 * @param {Array} items - Array of items with location data
 * @param {number} userLat - User latitude
 * @param {number} userLng - User longitude
 * @param {number} maxDistance - Maximum distance in km (optional)
 * @returns {Array} Items with distance added and sorted by distance
 */
export const findNearbyItems = (items, userLat, userLng, maxDistance = null) => {
  if (!validateCoordinates(userLat, userLng)) {
    return items;
  }

  const itemsWithDistance = items.map(item => {
    const itemObj = item.toObject ? item.toObject() : item;
    let distance = null;

    // Try to get coordinates from the item
    const coords = extractCoordinates(itemObj);
    
    if (coords) {
      distance = calculateDistanceBetweenCoordinates(userLat, userLng, coords.lat, coords.lng);
    } else if (itemObj.city) {
      // Fallback to city-based distance calculation
      const cityCoords = getCityCoordinates(itemObj.city);
      if (cityCoords) {
        distance = calculateDistanceBetweenCoordinates(userLat, userLng, cityCoords.lat, cityCoords.lon);
      }
    }

    return {
      ...itemObj,
      distance,
      distanceText: distance ? `${distance} km away` : 'Distance unavailable'
    };
  });

  // Filter by max distance if specified
  let filteredItems = itemsWithDistance;
  if (maxDistance && typeof maxDistance === 'number') {
    filteredItems = itemsWithDistance.filter(item => 
      item.distance !== null && item.distance <= maxDistance
    );
  }

  // Sort by distance (closest first)
  return filteredItems.sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });
};

/**
 * Update location data for an item
 * @param {object} itemData - Item data with location information
 * @returns {object} Updated item data with location fields
 */
export const updateLocationData = async (itemData) => {
  const updatedData = { ...itemData };

  // If coordinates are provided, use them
  if (itemData.latitude && itemData.longitude) {
    if (validateCoordinates(itemData.latitude, itemData.longitude)) {
      updatedData.location = createGeoJSONPoint(itemData.latitude, itemData.longitude);
    }
  } 
  // If no coordinates but address/city provided, try to geocode
  else if (itemData.address || itemData.city) {
    const coords = await geocodeAddress(itemData.address || '', itemData.city || '');
    if (coords) {
      updatedData.latitude = coords.lat;
      updatedData.longitude = coords.lng;
      updatedData.location = createGeoJSONPoint(coords.lat, coords.lng);
    }
  }

  return updatedData;
};

export default {
  geocodeAddress,
  calculateDistanceBetweenCoordinates,
  validateCoordinates,
  createGeoJSONPoint,
  extractCoordinates,
  findNearbyItems,
  updateLocationData
};