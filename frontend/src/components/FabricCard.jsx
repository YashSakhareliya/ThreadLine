import React from 'react';
import { Star } from 'lucide-react';

const FabricCard = ({
  name,
  image,
  price,
  rating,
  type,
  color,
  reviews,
  stock,
  onViewDetails
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {!stock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <div className="flex items-center mb-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
          <span className="ml-1 text-gray-500">({reviews} reviews)</span>
        </div>
        <div className="text-gray-600 mb-2">
          Type: {type}
        </div>
        <div className="text-gray-600 mb-4">
          Color: {color}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
          ₹{price}/meter
          </span>
          <button
            onClick={onViewDetails}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            disabled={!stock}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FabricCard;
