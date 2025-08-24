import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  ShoppingBag,
  Star,
  Users,
  Save,
  X,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Loader,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import shopService from '../../services/shopService';
import fabricService from '../../services/fabricService';
import orderService from '../../services/orderService';

const ShopDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFabric, setShowAddFabric] = useState(false);
  const [editingFabric, setEditingFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [shop, setShop] = useState(null);
  const [editingShop, setEditingShop] = useState(false);
  
  const [shopFabrics, setShopFabrics] = useState([]);
  const [newFabric, setNewFabric] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    color: '',
    material: '',
    width: '',
    description: '',
    image: ''
  });

  const [shopDetails, setShopDetails] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    image: '',
    businessLicense: '',
    gstNumber: ''
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [fabricsLoading, setFabricsLoading] = useState(false);

  const stats = [
    { label: 'Total Products', value: shopFabrics.length, icon: Package, color: 'text-blue-600' },
    { label: 'Orders Received', value: orders.length, icon: ShoppingBag, color: 'text-green-600' },
    { label: 'Shop Rating', value: shop?.rating?.toFixed(1) || 'N/A', icon: Star, color: 'text-yellow-600' },
    { label: 'Total Reviews', value: shop?.totalReviews || 0, icon: Users, color: 'text-purple-600' }
  ];

  const handleAddFabric = async () => {
    if (!shop?._id) return;
    
    try {
      setUpdating(true);
      const fabricData = {
        ...newFabric,
        price: parseFloat(newFabric.price),
        stock: parseInt(newFabric.stock),
        image: newFabric.image || 'https://images.pexels.com/photos/6069115/pexels-photo-6069115.jpeg?auto=compress&cs=tinysrgb&w=800'
      };
      
      await fabricService.createFabric(shop._id, fabricData);
      await fetchShopFabrics(shop._id);
      
      setNewFabric({
        name: '', price: '', stock: '', category: '', color: '', material: '', width: '', description: '', image: ''
      });
      setShowAddFabric(false);
      setError(null);
    } catch (err) {
      console.error('Error adding fabric:', err);
      setError('Failed to add fabric. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditFabric = (fabric) => {
    console.log(fabric)
    setEditingFabric(fabric);
    setNewFabric({
      name: fabric.name,
      price: fabric.price.toString(),
      stock: fabric.stock.toString(),
      category: fabric.category,
      color: fabric.color,
      material: fabric.material,
      width: fabric.width,
      description: fabric.description,
      image: fabric.image
    });
  };

  const handleUpdateFabric = async () => {
    if (!editingFabric?._id) return;
    
    try {
      setUpdating(true);
      const fabricData = {
        ...newFabric,
        price: parseFloat(newFabric.price),
        stock: parseInt(newFabric.stock)
      };
      
      await fabricService.updateFabric(editingFabric._id, fabricData);
      await fetchShopFabrics(shop._id);
      
      setEditingFabric(null);
      setNewFabric({
        name: '', price: '', stock: '', category: '', color: '', material: '', width: '', description: '', image: ''
      });
      setError(null);
    } catch (err) {
      console.error('Error updating fabric:', err);
      setError('Failed to update fabric. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteFabric = async (fabricId) => {
    if (!window.confirm('Are you sure you want to delete this fabric?')) return;
    
    try {
      setUpdating(true);
      await fabricService.deleteFabric(fabricId);
      await fetchShopFabrics(shop._id);
      setError(null);
    } catch (err) {
      console.error('Error deleting fabric:', err);
      setError('Failed to delete fabric. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'shop-details', name: 'Shop Details', icon: Store },
    { id: 'products', name: 'Manage Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingBag }
  ];

  // Fetch shop data on component mount
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        // Get user's shop - find shop owned by current user
        const shopsResponse = await shopService.getAllShops({ limit: 100 });
        console.log(shopsResponse)
        const userShop = shopsResponse.data.data.find(s => {
          // Handle both populated and non-populated owner fields
          const ownerId = s.owner?._id || s.owner;
          return ownerId === user._id;
        });
        console.log(user)
        if (userShop) {
          setShop(userShop);
          setShopDetails({
            name: userShop.name || '',
            description: userShop.description || '',
            email: userShop.email || '',
            phone: userShop.phone || '',
            address: userShop.address || '',
            city: userShop.city || '',
            state: userShop.state || '',
            zipCode: userShop.zipCode || '',
            country: userShop.country || 'India',
            image: userShop.image || '',
            businessLicense: userShop.businessLicense || '',
            gstNumber: userShop.gstNumber || ''
          });
          
          // Fetch fabrics for this shop
          const fabricsResponse = await fabricService.getFabricsByShop(userShop._id);
          setShopFabrics(fabricsResponse.data.data || []);
          
          // Fetch orders for this shop
          const ordersResponse = await orderService.getShopOrders(userShop._id);
          setOrders(ordersResponse.data.data || []);
        } else {
          setError('No shop found for this user. Please create a shop first.');
        }
      } catch (err) {
        console.error('Error fetching shop data:', err);
        setError('Failed to load shop data');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if user is loaded and has an _id
    if (user && user._id) {
      fetchShopData();
    }
  }, [user]);

  const fetchShopFabrics = async (shopId) => {
    try {
      setFabricsLoading(true);
      const response = await fabricService.getFabricsByShop(shopId);
      setShopFabrics(response.data.data || []);
    } catch (err) {
      console.error('Error fetching shop fabrics:', err);
    } finally {
      setFabricsLoading(false);
    }
  };

  const fetchShopOrders = async (shopId) => {
    try {
      setOrdersLoading(true);
      const response = await orderService.getShopOrders(shopId);
      setOrders(response.data.data || []);
    } catch (err) {
      console.error('Error fetching shop orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateShopDetails = async () => {
    if (!shop?._id) return;
    
    try {
      setUpdating(true);
      const response = await shopService.updateShop(shop._id, shopDetails);
      setShop(response.data.data);
      setEditingShop(false);
      setError(null);
    } catch (err) {
      console.error('Error updating shop:', err);
      setError('Failed to update shop details. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchShopOrders(shop._id);
      setError(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-shop-primary" />
      </div>
    );
  }

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
            Shop Dashboard
          </h1>
          <p className="text-slate-600">
            Manage your shop details, fabric inventory, track orders, and grow your business
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-shop-primary shadow-md'
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
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Recent Orders</h3>
                    {ordersLoading && <Loader className="w-4 h-4 animate-spin text-shop-primary" />}
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order._id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-800">{order.customer}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {order.items?.length || 0} item(s)
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="font-semibold text-slate-800">₹{order.total}</span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && !ordersLoading && (
                      <p className="text-slate-500 text-center py-4">No orders yet</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Top Products</h3>
                    {fabricsLoading && <Loader className="w-4 h-4 animate-spin text-shop-primary" />}
                  </div>
                  <div className="space-y-3">
                    {shopFabrics.slice(0, 3).map((fabric) => (
                      <div key={fabric._id} className="flex items-center space-x-3">
                        <img
                          src={fabric.image}
                          alt={fabric.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm">{fabric.name}</h4>
                          <p className="text-xs text-slate-600">Stock: {fabric.stock}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">₹{fabric.price}</p>
                        </div>
                      </div>
                    ))}
                    {shopFabrics.length === 0 && !fabricsLoading && (
                      <p className="text-slate-500 text-center py-4">No products yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shop Overview */}
              {shop && (
                <div className="card">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Shop Information</h3>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                      <img
                        src={shop.image || '/placeholder.svg'}
                        alt={shop.name}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>
                    <div className="lg:w-2/3 space-y-3">
                      <h4 className="text-2xl font-bold text-slate-800">{shop.name}</h4>
                      <p className="text-slate-600">{shop.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-shop-primary" />
                          <span>{`${shop.address}, ${shop.city}, ${shop.state} ${shop.zipCode}`}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-shop-primary" />
                          <span>{shop.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-shop-primary" />
                          <span>{shop.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-shop-primary" />
                          <span>Since {new Date(shop.createdAt || shop.established).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shop-details' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Shop Details</h2>
                {!editingShop && (
                  <button
                    onClick={() => setEditingShop(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-shop-primary to-shop-secondary text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Details</span>
                  </button>
                )}
              </div>

              <div className="card">
                {editingShop ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-800">Update Shop Information</h3>
                      <button
                        onClick={() => setEditingShop(false)}
                        className="p-2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Shop Name *
                        </label>
                        <input
                          type="text"
                          value={shopDetails.name}
                          onChange={(e) => setShopDetails({...shopDetails, name: e.target.value})}
                          className="input-field"
                          placeholder="Enter shop name"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={shopDetails.description}
                          onChange={(e) => setShopDetails({...shopDetails, description: e.target.value})}
                          rows={3}
                          className="input-field resize-none"
                          placeholder="Describe your shop and specialties"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={shopDetails.email}
                          onChange={(e) => setShopDetails({...shopDetails, email: e.target.value})}
                          className="input-field"
                          placeholder="shop@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={shopDetails.phone}
                          onChange={(e) => setShopDetails({...shopDetails, phone: e.target.value})}
                          className="input-field"
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={shopDetails.address}
                          onChange={(e) => setShopDetails({...shopDetails, address: e.target.value})}
                          className="input-field"
                          placeholder="Street address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shopDetails.city}
                          onChange={(e) => setShopDetails({...shopDetails, city: e.target.value})}
                          className="input-field"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={shopDetails.state}
                          onChange={(e) => setShopDetails({...shopDetails, state: e.target.value})}
                          className="input-field"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={shopDetails.zipCode}
                          onChange={(e) => setShopDetails({...shopDetails, zipCode: e.target.value})}
                          className="input-field"
                          placeholder="400001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={shopDetails.country}
                          onChange={(e) => setShopDetails({...shopDetails, country: e.target.value})}
                          className="input-field"
                          placeholder="India"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Shop Image URL
                        </label>
                        <input
                          type="url"
                          value={shopDetails.image}
                          onChange={(e) => setShopDetails({...shopDetails, image: e.target.value})}
                          className="input-field"
                          placeholder="https://example.com/shop-image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Business License
                        </label>
                        <input
                          type="text"
                          value={shopDetails.businessLicense}
                          onChange={(e) => setShopDetails({...shopDetails, businessLicense: e.target.value})}
                          className="input-field"
                          placeholder="Business license number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={shopDetails.gstNumber}
                          onChange={(e) => setShopDetails({...shopDetails, gstNumber: e.target.value})}
                          className="input-field"
                          placeholder="GST registration number"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={handleUpdateShopDetails}
                        disabled={updating}
                        className="flex items-center space-x-2 bg-gradient-to-r from-shop-primary to-shop-secondary text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {updating ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{updating ? 'Updating...' : 'Update Shop Details'}</span>
                      </button>
                      <button
                        onClick={() => setEditingShop(false)}
                        className="px-6 py-2 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800">Current Shop Information</h3>
                    
                    {shop && (
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
                            <h4 className="text-2xl font-bold text-slate-800 mb-2">{shop.name}</h4>
                            <div className="flex items-center space-x-2 mb-4">
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              <span className="text-lg font-semibold text-slate-700">
                                {shop.rating?.toFixed(1) || 'N/A'} ({shop.totalReviews || 0} reviews)
                              </span>
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
                                <p className="text-slate-600">{new Date(shop.createdAt || shop.established).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>

                          {(shop.businessLicense || shop.gstNumber) && (
                            <div className="pt-4 border-t border-slate-200">
                              <h5 className="font-semibold text-slate-700 mb-2">Business Information</h5>
                              <div className="space-y-2 text-sm">
                                {shop.businessLicense && (
                                  <p><span className="font-medium">Business License:</span> {shop.businessLicense}</p>
                                )}
                                {shop.gstNumber && (
                                  <p><span className="font-medium">GST Number:</span> {shop.gstNumber}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-slate-800">Manage Products</h2>
                  {fabricsLoading && <Loader className="w-4 h-4 animate-spin text-shop-primary" />}
                </div>
                <button
                  onClick={() => setShowAddFabric(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-shop-primary to-shop-secondary text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Add/Edit Fabric Form */}
              {(showAddFabric || editingFabric) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="card"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">
                      {editingFabric ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddFabric(false);
                        setEditingFabric(null);
                        setNewFabric({
                          name: '', price: '', stock: '', category: '', color: '', material: '', width: '', description: '', image: ''
                        });
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newFabric.name}
                      onChange={(e) => setNewFabric({...newFabric, name: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={newFabric.price}
                      onChange={(e) => setNewFabric({...newFabric, price: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={newFabric.stock}
                      onChange={(e) => setNewFabric({...newFabric, stock: e.target.value})}
                      className="input-field"
                    />
                    <select
                      value={newFabric.category}
                      onChange={(e) => setNewFabric({...newFabric, category: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      <option value="Silk">Silk</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Wool">Wool</option>
                      <option value="Synthetic">Synthetic</option>
                      <option value="Linen">Linen</option>
                      <option value="Chiffon">Chiffon</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Color"
                      value={newFabric.color}
                      onChange={(e) => setNewFabric({...newFabric, color: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Material"
                      value={newFabric.material}
                      onChange={(e) => setNewFabric({...newFabric, material: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Width (e.g., 44 inches)"
                      value={newFabric.width}
                      onChange={(e) => setNewFabric({...newFabric, width: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={newFabric.image}
                      onChange={(e) => setNewFabric({...newFabric, image: e.target.value})}
                      className="input-field"
                    />
                    <textarea
                      placeholder="Description"
                      value={newFabric.description}
                      onChange={(e) => setNewFabric({...newFabric, description: e.target.value})}
                      rows={3}
                      className="input-field md:col-span-2 resize-none"
                    />
                  </div>
                  
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={editingFabric ? handleUpdateFabric : handleAddFabric}
                      disabled={updating}
                      className="flex items-center space-x-2 bg-gradient-to-r from-shop-primary to-shop-secondary text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {updating ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{updating ? 'Saving...' : (editingFabric ? 'Update Product' : 'Add Product')}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopFabrics.map((fabric) => (
                  <motion.div
                    key={fabric._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                  >
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-bold text-slate-800 mb-2">{fabric.name}</h3>
                    <div className="space-y-1 text-sm text-slate-600 mb-4">
                      <p>Price: ₹{fabric.price}</p>
                      <p>Stock: {fabric.stock} units</p>
                      <p>Category: {fabric.category}</p>
                      <p>Color: {fabric.color}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditFabric(fabric)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 border border-shop-primary text-shop-primary rounded-lg hover:bg-shop-primary hover:text-white transition-colors duration-300"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteFabric(fabric._id)}
                        disabled={updating}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-300 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {shopFabrics.length === 0 && !fabricsLoading && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No products yet</h3>
                  <p className="text-slate-500">Add your first fabric to get started!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
                {ordersLoading && <Loader className="w-4 h-4 animate-spin text-shop-primary" />}
              </div>
              
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800">Order #{order._id.slice(-8)}</h3>
                        <p className="text-slate-600">Customer: {order.customer}</p>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        {order.trackingNumber && (
                          <p className="text-sm text-blue-600">Tracking: {order.trackingNumber}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-slate-600">
                        {order.items?.length || 0} item(s) • Total: ₹{order.total}
                      </p>
                      {order.shippingAddress && (
                        <p className="text-sm text-slate-500 mt-1">
                          Ship to: {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-slate-800">
                        Total: ₹{order.total}
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="px-3 py-1 border border-slate-300 rounded-lg text-sm font-semibold bg-white hover:bg-slate-50 transition-colors duration-300"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button className="px-3 py-1 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {orders.length === 0 && !ordersLoading && (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">No orders yet</h3>
                    <p className="text-slate-500">Orders will appear here when customers purchase your fabrics.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopDashboard;