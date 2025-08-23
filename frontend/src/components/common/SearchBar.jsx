import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { cities } from '../../data/mockData';

const SearchBar = ({ onSearch, placeholder = "Search shops & tailors..." }) => {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCities, setShowCities] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, city: selectedCity });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass rounded-2xl p-2 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-4 bg-transparent border-0 focus:outline-none text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* City Selector */}
          <div className="relative">
            <div className="flex items-center">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-12 pr-8 py-4 bg-transparent border-0 focus:outline-none text-slate-700 appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-customer-primary to-customer-secondary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default SearchBar;