import React from 'react';
import { Star, MapPin } from 'lucide-react';

const TailorCard = ({
  name,
  image,
  rating,
  specialty,
  location,
  price,
  reviews,
  onViewProfile
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <div className="flex items-center mb-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
          <span className="ml-1 text-gray-500">({reviews} reviews)</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </div>
        <div className="text-gray-600 mb-4">
          Specialty: {specialty}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            Starting at ₹{price}
          </span>
          <button
            onClick={onViewProfile}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailorCard;
