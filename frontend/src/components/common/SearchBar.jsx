import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter } from 'lucide-react';
import { cities } from '../../data/mockData';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search fabrics, shops & tailors...",
  showFilters = false,
  searchType = 'all' 
}) => {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState(searchType);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    material: '',
    minRating: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ 
      query, 
      city: selectedCity, 
      type: selectedType,
      ...filters 
    });
  };

  const searchTypes = [
    { value: 'all', label: 'All' },
    { value: 'fabrics', label: 'Fabrics' },
    { value: 'shops', label: 'Shops' },
    { value: 'tailors', label: 'Tailors' }
  ];

  const categories = [
    'Traditional', 'Formal', 'Casual', 'Ethnic', 'Western', 'Wedding', 'Party'
  ];

  const materials = [
    'Cotton', 'Silk', 'Linen', 'Chiffon', 'Georgette', 'Velvet', 'Satin', 'Crepe', 'Wool', 'Polyester'
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="glass rounded-2xl p-2 shadow-2xl">
        <div className="flex flex-col gap-2">
          {/* Main Search Row */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search Type Selector */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-4 bg-transparent border-0 focus:outline-none text-slate-700 appearance-none cursor-pointer min-w-[120px] font-semibold"
              >
                {searchTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

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

            {/* Filter Button */}
            {showFilters && (
              <motion.button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  showAdvancedFilters 
                    ? 'bg-customer-primary text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </motion.button>
            )}

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

          {/* Advanced Filters */}
          {showFilters && showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 pt-4 mt-2"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customer-primary text-sm"
                  >
                    <option value="">Any Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                  <select
                    value={filters.material}
                    onChange={(e) => setFilters({...filters, material: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customer-primary text-sm"
                  >
                    <option value="">Any Material</option>
                    {materials.map((mat) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customer-primary text-sm"
                  >
                    <option value="">Any Rating</option>
                    <option value="1">1+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    placeholder="₹0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customer-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    placeholder="₹10000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customer-primary text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.form>
  );
};

export default SearchBar;