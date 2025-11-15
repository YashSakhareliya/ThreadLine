import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { requestUserLocation } from '../utils/geolocation';
import customerService from '../services/customerService';

/**
 * Custom hook to automatically track and update customer location
 * Updates location on mount and when page refreshes
 */
const useCustomerLocation = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const updateLocation = useCallback(async () => {
    // Only update for authenticated customers
    if (!isAuthenticated || user?.role !== 'customer') {
      return;
    }

    try {
      // Get current location from browser
      const locationResult = await requestUserLocation();
      
      if (locationResult.success) {
        const { lat, lon } = locationResult.data;
        
        // Save to backend
        await customerService.updateCustomerLocation(lat, lon);
        
        console.log('Customer location updated:', { lat, lon });
      } else {
        console.log('Location not available:', locationResult.error);
      }
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.error('Failed to update customer location:', error);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Update location when component mounts (includes page refresh)
    updateLocation();
  }, [updateLocation]);

  return { updateLocation };
};

export default useCustomerLocation;
