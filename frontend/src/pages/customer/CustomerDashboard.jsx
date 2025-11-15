import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Scissors,
} from 'lucide-react';
import ShopCard from '../../components/cards/ShopCard';
import TailorCard from '../../components/cards/TailorCard';
import { useAuth } from '../../contexts/AuthContext';
import customerService from '../../services/customerService';
import shopService from '../../services/shopService';
import tailorService from '../../services/tailorService';

const CustomerDashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('shops');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [allShops, setAllShops] = useState([]);
  const [allTailors, setAllTailors] = useState([]);

  // Fetch customer data and dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Wait for auth to complete and ensure user is authenticated
      if (authLoading || !isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch customer data and shops/tailors
        const [dashboardResponse, shopsResponse, tailorsResponse] = await Promise.all([
          customerService.getDashboardStats(),
          shopService.getAllShops(),
          tailorService.getAllTailors()
        ]);

        if (dashboardResponse.success) {
          setCustomerData(dashboardResponse.data.customer);
        }

        if (shopsResponse.success) {
          setAllShops(shopsResponse.data);
        }

        if (tailorsResponse.success) {
          setAllTailors(tailorsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAuthenticated, authLoading]);

  const handleToggleFavoriteShop = async (shopId) => {
    try {
      if (customerData?.favoriteShops?.includes(shopId)) {
        await customerService.removeFavoriteShop(shopId);
      } else {
        await customerService.addFavoriteShop(shopId);
      }
      // Refresh customer data
      const response = await customerService.getDashboardStats();
      if (response.success) {
        setCustomerData(response.data.customer);
      }
    } catch (error) {
      console.error('Error toggling favorite shop:', error);
    }
  };

  const handleToggleFavoriteTailor = async (tailorId) => {
    try {
      if (customerData?.favoriteTailors?.includes(tailorId)) {
        await customerService.removeFavoriteTailor(tailorId);
      } else {
        await customerService.addFavoriteTailor(tailorId);
      }
      // Refresh customer data
      const response = await customerService.getDashboardStats();
      if (response.success) {
        setCustomerData(response.data.customer);
      }
    } catch (error) {
      console.error('Error toggling favorite tailor:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customer-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'shops', name: 'Browse Shops', icon: ShoppingBag },
    { id: 'tailors', name: 'Find Tailors', icon: Scissors },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-600">
            Discover amazing fabrics and connect with skilled tailors in{' '}
            {user?.city}
          </p>
        </motion.div>


        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-customer-primary shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'shops' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Browse Fabric Shops
                </h2>
                <div className="text-sm text-slate-600">
                  {customerData?.favoriteShops?.length || 0} favorites
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allShops.map((shop) => (
                  <ShopCard 
                    key={shop._id} 
                    shop={shop} 
                    isFavorite={customerData?.favoriteShops?.includes(shop._id)}
                    onToggleFavorite={() => handleToggleFavoriteShop(shop._id)}
                  />
                ))}
              </div>
              {allShops.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    No shops found
                  </h3>
                  <p className="text-slate-500">
                    Check back later for new fabric shops
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tailors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Find Expert Tailors
                </h2>
                <div className="text-sm text-slate-600">
                  {customerData?.favoriteTailors?.length || 0} favorites
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTailors.map((tailor) => (
                  <TailorCard 
                    key={tailor._id} 
                    tailor={tailor} 
                    isFavorite={customerData?.favoriteTailors?.includes(tailor._id)}
                    onToggleFavorite={() => handleToggleFavoriteTailor(tailor._id)}
                  />
                ))}
              </div>
              {allTailors.length === 0 && (
                <div className="text-center py-12">
                  <Scissors className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    No tailors found
                  </h3>
                  <p className="text-slate-500">
                    Check back later for expert tailors in your area
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
