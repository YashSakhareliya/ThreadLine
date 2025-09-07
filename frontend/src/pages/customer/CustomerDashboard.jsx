import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Scissors,
  MapPin,
  Star,
  Package,
  TrendingUp,
  Heart,
  Clock,
  Calendar,
} from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import ShopCard from '../../components/cards/ShopCard';
import TailorCard from '../../components/cards/TailorCard';
import OrderCard from '../../components/cards/OrderCard';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import customerService from '../../services/customerService';
import shopService from '../../services/shopService';
import tailorService from '../../services/tailorService';
import orderService from '../../services/orderService';

const CustomerDashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { orders } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [allShops, setAllShops] = useState([]);
  const [allTailors, setAllTailors] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  // Fetch customer data and dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Wait for auth to complete and ensure user is authenticated
      if (authLoading || !isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch dashboard stats (includes customer profile, stats, and recent orders)
        const dashboardResponse = await customerService.getDashboardStats();
        if (dashboardResponse.success) {
          setCustomerData(dashboardResponse.data.customer);
          setUserOrders(dashboardResponse.data.recentOrders);
          setDashboardStats(dashboardResponse.data.stats);
        }

        // Fetch shops and tailors for browse tabs
        const [shopsResponse, tailorsResponse] = await Promise.all([
          shopService.getAllShops(),
          tailorService.getAllTailors()
        ]);

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

  const recentShops = allShops.slice(0, 3);
  const featuredTailors = allTailors.slice(0, 2);

  const stats = [
    {
      label: 'Total Orders',
      value: dashboardStats?.totalOrders || 0,
      icon: Package,
      color: 'text-blue-600',
    },
    { 
      label: 'Favorite Shops', 
      value: dashboardStats?.favoriteShops || 0, 
      icon: Heart, 
      color: 'text-red-600' 
    },
    {
      label: 'Favorite Tailors',
      value: dashboardStats?.favoriteTailors || 0,
      icon: Scissors,
      color: 'text-green-600',
    },
    { 
      label: 'Total Spent', 
      value: `₹${dashboardStats?.totalSpent?.toLocaleString() || 0}`, 
      icon: Star, 
      color: 'text-yellow-600' 
    },
  ];

  const handleSearch = ({ query, city }) => {
    console.log('Search:', { query, city });
    // Navigate to search results
  };

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
        setDashboardStats(response.data.stats);
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
        setDashboardStats(response.data.stats);
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
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'orders', name: 'My Orders', icon: Package },
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

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SearchBar onSearch={handleSearch} />
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
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="card text-center"
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Recent Orders
                  </h2>
                  <Link
                    to="/orders"
                    className="text-customer-primary hover:text-customer-secondary"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {userOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <div className="flex items-center space-x-2 text-slate-600 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <Package className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Shipping Details */}
                      {order.shippingDetails && (
                        <div className="bg-slate-50 p-3 rounded-lg mb-4">
                          <h4 className="font-semibold text-slate-700 mb-2">
                            Shipping Details
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-slate-600">Carrier: </span>
                              <span className="font-semibold">
                                {order.shippingDetails.carrier}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">Method: </span>
                              <span className="font-semibold">
                                {order.shippingDetails.method}
                              </span>
                            </div>
                            {order.trackingNumber && (
                              <div className="col-span-2">
                                <span className="text-slate-600">
                                  Tracking:{' '}
                                </span>
                                <span className="font-semibold text-customer-primary">
                                  {order.trackingNumber}
                                </span>
                              </div>
                            )}
                            {order.estimatedDelivery && (
                              <div className="col-span-2">
                                <span className="text-slate-600">
                                  Est. Delivery:{' '}
                                </span>
                                <span className="font-semibold">
                                  {new Date(
                                    order.estimatedDelivery
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="border-t border-slate-200 pt-3">
                          <h4 className="font-semibold text-slate-700 mb-2">
                            Items:
                          </h4>
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-slate-600">
                                {item.fabric?.name || `Fabric Item ${item.fabricId}`}
                              </span>
                              <span className="text-slate-800">
                                Qty: {item.quantity} × ₹{item.price}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-slate-200 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-700">
                              Total Amount:
                            </span>
                            <span className="text-xl font-bold text-customer-primary">
                              ₹{order.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {userOrders.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">No recent orders</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Shops */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Popular Shops
                  </h2>
                  <Link
                    to="#"
                    onClick={() => setActiveTab('shops')}
                    className="text-customer-primary hover:text-customer-secondary"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentShops.map((shop) => (
                    <ShopCard 
                      key={shop._id} 
                      shop={shop} 
                      isFavorite={customerData?.favoriteShops?.includes(shop._id)}
                      onToggleFavorite={() => handleToggleFavoriteShop(shop._id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                My Orders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
              {userOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Start shopping to see your orders here
                  </p>
                  <Link to="/shops" className="btn-primary">
                    Browse Shops
                  </Link>
                </div>
              )}
            </div>
          )}

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
