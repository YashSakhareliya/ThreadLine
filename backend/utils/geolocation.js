/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * City coordinates for major Indian cities
 * This is a fallback for when exact coordinates aren't available
 */
export const CITY_COORDINATES = {
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Delhi': { lat: 28.7041, lon: 77.1025 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Bengaluru': { lat: 12.9716, lon: 77.5946 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Surat': { lat: 21.1702, lon: 72.8311 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Jaipur': { lat: 26.9124, lon: 75.7873 },
  'Lucknow': { lat: 26.8467, lon: 80.9462 },
  'Kanpur': { lat: 26.4499, lon: 80.3319 },
  'Nagpur': { lat: 21.1458, lon: 79.0882 },
  'Indore': { lat: 22.7196, lon: 75.8577 },
  'Thane': { lat: 19.2183, lon: 72.9781 },
  'Bhopal': { lat: 23.2599, lon: 77.4126 },
  'Visakhapatnam': { lat: 17.6868, lon: 83.2185 },
  'Pimpri': { lat: 18.6298, lon: 73.8047 },
  'Patna': { lat: 25.5941, lon: 85.1376 },
  'Vadodara': { lat: 22.3072, lon: 73.1812 },
  'Ghaziabad': { lat: 28.6692, lon: 77.4538 },
  'Ludhiana': { lat: 30.9010, lon: 75.8573 },
  'Agra': { lat: 27.1767, lon: 78.0081 },
  'Nashik': { lat: 19.9975, lon: 73.7898 },
  'Faridabad': { lat: 28.4089, lon: 77.3178 },
  'Meerut': { lat: 28.9845, lon: 77.7064 },
  'Rajkot': { lat: 22.3039, lon: 70.8022 },
  'Kalyan': { lat: 19.2437, lon: 73.1355 },
  'Vasai': { lat: 19.4911, lon: 72.8065 },
  'Varanasi': { lat: 25.3176, lon: 82.9739 },
  'Srinagar': { lat: 34.0837, lon: 74.7973 },
  'Aurangabad': { lat: 19.8762, lon: 75.3433 },
  'Dhanbad': { lat: 23.7957, lon: 86.4304 },
  'Amritsar': { lat: 31.6340, lon: 74.8723 },
  'Navi Mumbai': { lat: 19.0330, lon: 73.0297 },
  'Allahabad': { lat: 25.4358, lon: 81.8463 },
  'Prayagraj': { lat: 25.4358, lon: 81.8463 },
  'Ranchi': { lat: 23.3441, lon: 85.3096 },
  'Howrah': { lat: 22.5958, lon: 88.2636 },
  'Coimbatore': { lat: 11.0168, lon: 76.9558 },
  'Jabalpur': { lat: 23.1815, lon: 79.9864 },
  'Gwalior': { lat: 26.2183, lon: 78.1828 },
  'Vijayawada': { lat: 16.5062, lon: 80.6480 },
  'Jodhpur': { lat: 26.2389, lon: 73.0243 },
  'Madurai': { lat: 9.9252, lon: 78.1198 },
  'Raipur': { lat: 21.2514, lon: 81.6296 },
  'Kota': { lat: 25.2138, lon: 75.8648 }
};

/**
 * Get coordinates for a city
 * @param {string} cityName 
 * @returns {object|null} {lat, lon} or null if not found
 */
export const getCityCoordinates = (cityName) => {
  if (!cityName) return null;
  
  const normalizedCity = cityName.trim();
  
  // Direct match
  if (CITY_COORDINATES[normalizedCity]) {
    return CITY_COORDINATES[normalizedCity];
  }
  
  // Case insensitive search
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (city.toLowerCase() === normalizedCity.toLowerCase()) {
      return coords;
    }
  }
  
  return null;
};

/**
 * Calculate distance between user location and a city
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {string} targetCity - Target city name
 * @returns {number|null} Distance in km or null if city not found
 */
export const calculateDistanceToCity = (userLat, userLon, targetCity) => {
  const cityCoords = getCityCoordinates(targetCity);
  if (!cityCoords) return null;
  
  return calculateDistance(userLat, userLon, cityCoords.lat, cityCoords.lon);
};

export default {
  calculateDistance,
  CITY_COORDINATES,
  getCityCoordinates,
  calculateDistanceToCity
};