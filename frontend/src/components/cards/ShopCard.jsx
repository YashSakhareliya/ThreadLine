import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Calendar } from 'lucide-react';

const ShopCard = ({ shop }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card group"
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={shop.image || '/placeholder.svg'}
          alt={shop.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-slate-700">{shop.rating}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-customer-primary transition-colors duration-300">
          {shop.name}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-2">
          {shop.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-600">
            <MapPin className="w-4 h-4 text-customer-primary" />
            <span className="text-sm">{shop.city}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-600">
            <Phone className="w-4 h-4 text-customer-primary" />
            <span className="text-sm">{shop.phone}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-600">
            <Calendar className="w-4 h-4 text-customer-primary" />
            <span className="text-sm">Est. {shop.established || new Date(shop.createdAt).getFullYear()}</span>
          </div>
        </div>

        <Link
          to={`/shop/${shop._id}`}
          className="block w-full text-center btn-primary mt-4"
        >
          View Shop
        </Link>
      </div>
    </motion.div>
  );
};

export default ShopCard;