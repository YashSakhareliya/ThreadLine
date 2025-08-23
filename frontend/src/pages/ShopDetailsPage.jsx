import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Filter,
  Grid,
  List,
  Loader
} from 'lucide-react';
import FabricCard from '../components/cards/FabricCard';
import shopService from '../services/shopService';
import fabricService from '../services/fabricService';

const ShopDetailsPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [shopFabrics, setShopFabrics] = useState([]);
  const [filteredFabrics, setFilteredFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    color: '',
    sortBy: 'name'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const shopRes = await shopService.getShopById(id);
        const fabricsRes = await fabricService.getFabricsByShop(id);
        setShop(shopRes.data.data);
        setShopFabrics(fabricsRes.data.data);
        setFilteredFabrics(fabricsRes.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch shop details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    let filtered = [...shopFabrics];

    if (filters.category) {
      filtered = filtered.filter(fabric => fabric.category === filters.category);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(fabric => {
        if (max) {
          return fabric.price >= min && fabric.price <= max;
        } else {
          return fabric.price >= min;
        }
      });
    }

    if (filters.color) {
      filtered = filtered.filter(fabric => 
        fabric.color.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setFilteredFabrics(filtered);
  }, [shopFabrics, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const categories = [...new Set(shopFabrics.map(f => f.category))];
  const colors = [...new Set(shopFabrics.map(f => f.color))];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-customer-primary" />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen pt-20 text-center">
        <h2 className="text-2xl text-red-500">{error || 'Shop not found.'}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <img
                src={shop.image || '/placeholder.svg'}
                alt={shop.name}
                className="w-full h-64 lg:h-80 object-cover rounded-xl"
              />
            </div>
            
            <div className="lg:w-2/3 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                  {shop.name}
                </h1>
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold text-slate-700">{shop.rating || 'N/A'}</span>
                </div>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed">
                {shop.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-shop-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Address</p>
                    <p className="text-slate-600">{`${shop.address}, ${shop.city}, ${shop.state} ${shop.zipCode}`}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-shop-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Phone</p>
                    <p className="text-slate-600">{shop.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-shop-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Email</p>
                    <p className="text-slate-600">{shop.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-shop-primary" />
                  <div>
                    <p className="font-semibold text-slate-700">Member Since</p>
                    <p className="text-slate-600">{new Date(shop.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Available Fabrics ({filteredFabrics.length})
            </h2>
            
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
                    viewMode === 'grid' ? 'bg-shop-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    viewMode === 'list' ? 'bg-shop-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredFabrics.map((fabric, index) => (
              <motion.div
                key={fabric._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FabricCard fabric={fabric} />
              </motion.div>
            ))}
          </div>

          {!loading && filteredFabrics.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No fabrics found
              </h3>
              <p className="text-slate-500">
                Try adjusting your filters to see more results.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopDetailsPage;