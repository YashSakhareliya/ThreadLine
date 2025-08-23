import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Search, Palette, Package, Ruler, ShoppingCart, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialFabrics, setFilters, clearFilters } from '../store/slices/fabricsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/common/SearchBar';
import fabricService from '../services/fabricService';

const AllFabricsPage = () => {
  const dispatch = useDispatch();
  const { filteredFabrics, filters } = useSelector(state => state.fabrics);
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        setLoading(true);
        const res = await fabricService.getAllFabrics();
        dispatch(setInitialFabrics(res.data.data || []));
        setError(null);
      } catch (err) {
        setError('Failed to fetch fabrics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFabrics();
  }, [dispatch]);

  const categories = [...new Set(filteredFabrics.map(f => f.category))];
  const colors = [...new Set(filteredFabrics.map(f => f.color))];
  const materials = [...new Set(filteredFabrics.map(f => f.material))];

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleSearch = ({ query, city }) => {
    // Apply search filters
    dispatch(setFilters({ 
      city: city || '',
      // Add text search logic here if needed
    }));
  };

  const handleAddToCart = (fabric) => {
    if (user && user.role === 'customer') {
      dispatch(addToCart({ fabric, quantity: 1 }));
    }
  };


  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            All Fabrics
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover premium fabrics from verified shops across India with quality materials and competitive prices.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SearchBar onSearch={handleSearch} placeholder="Search fabrics by name, material, or color..." />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 btn-secondary"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === 'grid' ? 'bg-customer-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === 'list' ? 'bg-customer-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-600">
              Showing {filteredFabrics.length} fabrics
            </span>
            <button
              onClick={() => dispatch(clearFilters())}
              className="text-customer-primary hover:text-customer-secondary transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Price</option>
                  <option value="0-1000">₹0 - ₹1,000</option>
                  <option value="1000-2500">₹1,000 - ₹2,500</option>
                  <option value="2500-5000">₹2,500 - ₹5,000</option>
                  <option value="5000">₹5,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Color
                </label>
                <select
                  value={filters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Colors</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Material
                </label>
                <select
                  value={filters.material}
                  onChange={(e) => handleFilterChange('material', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Materials</option>
                  {materials.map((material) => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock">Stock</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-12 h-12 animate-spin text-customer-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-500">{error}</h3>
          </div>
        )}

        {/* Fabrics Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredFabrics.map((fabric, index) => (
            <motion.div
              key={fabric._id || fabric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card group"
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={fabric.image || fabric.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={fabric.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
                  <span className="text-sm font-bold text-slate-700">₹{fabric.price}</span>
                </div>
                {fabric.stock < 10 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    Low Stock
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-customer-primary transition-colors duration-300">
                  {fabric.name}
                </h3>
                
                <p className="text-slate-600 text-sm line-clamp-2">
                  {fabric.description}
                </p>

                <div className="text-sm text-slate-600">
                  <p className="font-semibold">Shop: {fabric.shop?.name || 'Unknown Shop'}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Palette className="w-4 h-4 text-customer-primary" />
                    <span>{fabric.color}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Package className="w-4 h-4 text-customer-primary" />
                    <span>{fabric.stock} units</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Ruler className="w-4 h-4 text-customer-primary" />
                    <span>{fabric.specifications?.width || 'N/A'}</span>
                  </div>
                  
                  <div className="text-slate-600">
                    <span className="font-semibold">{fabric.material}</span>
                  </div>
                </div>

                {user && user.role === 'customer' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(fabric)}
                    disabled={fabric.stock === 0}
                    className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{fabric.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredFabrics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No fabrics found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search criteria or filters.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllFabricsPage;