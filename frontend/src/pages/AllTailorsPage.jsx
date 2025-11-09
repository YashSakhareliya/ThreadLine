import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Search, Star, MapPin, Award, Clock, MessageCircle, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters, setInitialTailors } from '../store/slices/tailorsSlice';
import SearchBar from '../components/common/SearchBar';
import tailorService from '../services/tailorService';
import { useNavigate } from 'react-router-dom';

const AllTailorsPage = () => {
  const dispatch = useDispatch();
  const { filteredTailors, filters } = useSelector(state => state.tailors);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        setLoading(true);
        
        // Fetch all tailors
        const res = await tailorService.getAllTailors();
        
        const tailors = res.data.data;
        console.log('Tailors received:', tailors.length);
        console.log('Sample tailor data:', tailors[0]);
        
        dispatch(setInitialTailors(tailors));
        setCities([...new Set(tailors.map(t => t.city))]);
        setSpecializations([...new Set(tailors.flatMap(t => t.specialization))]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tailors. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTailors();
  }, [dispatch, isAuthenticated, user]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleSearch = ({ query, city }) => {
    dispatch(setFilters({ 
      city: city || '',
      searchQuery: query || ''
    }));
  };

  const handleContactTailor = (tailor) => {
    console.log('Contacting tailor:', tailor.name);
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
            Expert Tailors
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Connect with skilled tailors in your city. View portfolios, ratings, and reviews to find the perfect craftsperson for your needs.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SearchBar onSearch={handleSearch} placeholder="Search tailors by city or specialization..." />
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
                  viewMode === 'grid' ? 'bg-tailor-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === 'list' ? 'bg-tailor-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-600">
              Showing {filteredTailors.length} tailors
            </span>
            <button
              onClick={() => dispatch(clearFilters())}
              className="text-tailor-primary hover:text-tailor-secondary transition-colors duration-300"
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
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Specialization
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Experience</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                  <option value="15">15+ Years</option>
                  <option value="20">20+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
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
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                  <option value="name">Name</option>
                  <option value="city">City</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tailors Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredTailors.map((tailor, index) => (
            <motion.div
              key={tailor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card group"
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={tailor.portfolio[0] || '/placeholder.svg'}
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
                  {(tailor.specialization || []).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-tailor-primary/10 to-tailor-secondary/10 text-tailor-primary text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Portfolio Preview */}
                {tailor.portfolio && tailor.portfolio.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Portfolio</h4>
                    <div className="grid grid-cols-3 gap-1">
                      {tailor.portfolio.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Preview */}
                {tailor.reviews && tailor.reviews.length > 0 ? (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Recent Review</h4>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(tailor.reviews[0].rating) 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-600">by {tailor.reviews[0].customerName}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      "{tailor.reviews[0].comment}"
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Reviews</h4>
                    <p className="text-xs text-slate-500">
                      No reviews yet. Be the first to review this tailor!
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/tailor/${tailor._id}`)}
                    className="flex-1 bg-gradient-to-r from-tailor-primary to-tailor-secondary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    View Portfolio
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/tailor/${tailor._id}`)}
                    className="px-4 py-3 border-2 border-tailor-primary text-tailor-primary rounded-xl font-semibold hover:bg-tailor-primary hover:text-white transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTailors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No tailors found
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

export default AllTailorsPage;