import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Award, Clock } from 'lucide-react';

const TailorCard = ({ tailor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card group"
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={tailor.image}
          alt={tailor.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-slate-700">{tailor.rating}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-tailor-primary transition-colors duration-300">
          {tailor.name}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-2">
          {tailor.bio}
        </p>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-600">
            <MapPin className="w-4 h-4 text-tailor-primary" />
            <span className="text-sm">{tailor.city}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="w-4 h-4 text-tailor-primary" />
            <span className="text-sm">{tailor.experience} years experience</span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-600">
            <Award className="w-4 h-4 text-tailor-primary" />
            <span className="text-sm">{tailor.priceRange}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {tailor.specialization.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gradient-to-r from-tailor-primary/10 to-tailor-secondary/10 text-tailor-primary text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = `/tailor/${tailor.id}`}
          className="w-full bg-gradient-to-r from-tailor-primary to-tailor-secondary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          View Portfolio
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TailorCard;