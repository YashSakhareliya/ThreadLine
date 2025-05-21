import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ name, image, slug }) => {
  const navigate = useNavigate();

  return (
    <div className="relative group overflow-hidden rounded-lg">
      <img
        src={image}
        alt={name}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
        <h3 className="text-white text-xl font-semibold mb-2">{name}</h3>
        <button
          onClick={() => navigate(`/fabrics/${slug}`)}
          className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Browse Now
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
