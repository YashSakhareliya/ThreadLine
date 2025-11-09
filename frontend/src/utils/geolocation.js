/**
 * Get user's current location using browser geolocation API
 * @returns {Promise<{lat: number, lon: number}>} User's coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  });
};

/**
 * Check if geolocation is supported
 * @returns {boolean}
 */
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator;
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance === null || distance === undefined) {
    return 'Distance unavailable';
  }
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }
  
  return `${distance}km away`;
};

/**
 * Get geolocation permission status
 * @returns {Promise<string>} Permission status
 */
export const getGeolocationPermission = async () => {
  if (!navigator.permissions) {
    return 'unknown';
  }
  
  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state;
  } catch (error) {
    return 'unknown';
  }
};

/**
 * Request location with user-friendly error handling
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const requestUserLocation = async () => {
  try {
    if (!isGeolocationSupported()) {
      return {
        success: false,
        error: 'Geolocation is not supported by your browser'
      };
    }

    const permission = await getGeolocationPermission();
    if (permission === 'denied') {
      return {
        success: false,
        error: 'Location access denied. Please enable location services in your browser settings.'
      };
    }

    const location = await getCurrentLocation();
    return {
      success: true,
      data: location
    };
  } catch (error) {
    let errorMessage = 'Unable to get your location';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Please enable location services.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out. Please try again.';
        break;
      default:
        errorMessage = error.message || 'Unable to get your location';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};