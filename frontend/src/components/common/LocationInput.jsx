import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader, AlertCircle } from 'lucide-react';
import { requestUserLocation } from '../../utils/geolocation';

const LocationInput = ({ 
  latitude, 
  longitude, 
  onLocationChange, 
  address = '', 
  city = '',
  required = false,
  disabled = false,
  className = '' 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coordinates, setCoordinates] = useState({
    lat: latitude || '',
    lng: longitude || ''
  });

  useEffect(() => {
    setCoordinates({
      lat: latitude || '',
      lng: longitude || ''
    });
  }, [latitude, longitude]);

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setError('');
    
    try {
      const locationResult = await requestUserLocation();
      
      if (locationResult.success) {
        const newCoords = {
          lat: locationResult.data.lat,
          lng: locationResult.data.lon
        };
        setCoordinates(newCoords);
        onLocationChange(newCoords.lat, newCoords.lng);
      } else {
        setError(locationResult.error);
      }
    } catch (err) {
      setError('Failed to get location. Please enter coordinates manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleCoordinateChange = (field, value) => {
    const newCoords = { ...coordinates, [field]: value };
    setCoordinates(newCoords);
    
    // Only call onChange if both coordinates are valid numbers
    if (newCoords.lat && newCoords.lng && 
        !isNaN(newCoords.lat) && !isNaN(newCoords.lng)) {
      onLocationChange(parseFloat(newCoords.lat), parseFloat(newCoords.lng));
    }
  };

  const hasValidCoordinates = coordinates.lat && coordinates.lng && 
    !isNaN(coordinates.lat) && !isNaN(coordinates.lng);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Location Button */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Location Coordinates {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loading || disabled}
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>{loading ? 'Getting Location...' : 'Use Current Location'}</span>
        </button>
      </div>

      {/* Manual Coordinate Input */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={coordinates.lat}
            onChange={(e) => handleCoordinateChange('lat', e.target.value)}
            disabled={disabled}
            placeholder="e.g., 19.0760"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={coordinates.lng}
            onChange={(e) => handleCoordinateChange('lng', e.target.value)}
            disabled={disabled}
            placeholder="e.g., 72.8777"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
          />
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {hasValidCoordinates && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-600">
            Location set: {parseFloat(coordinates.lat).toFixed(4)}, {parseFloat(coordinates.lng).toFixed(4)}
          </p>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        {address || city ? (
          <>Coordinates will help calculate accurate distances. Address: {address} {city}</>
        ) : (
          'Coordinates help calculate accurate distances to customers. You can use your current location or enter coordinates manually.'
        )}
      </p>
    </div>
  );
};

export default LocationInput;