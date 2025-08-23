import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fabrics } from '../../data/mockData';

const ShopDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFabric, setShowAddFabric] = useState(false);
  const [editingFabric, setEditingFabric] = useState(null);
  
  const [shopFabrics, setShopFabrics] = useState(
    fabrics.filter(f => f.shopId === 1) // Assuming current user's shop ID is 1
  );

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

  const [orders] = useState([
    {
      id: 1,
      customerName: 'Priya Sharma',
      items: [{ fabricId: 1, quantity: 2, name: 'Premium Silk Saree Fabric' }],
      total: 5000,
      status: 'Pending',
      orderDate: '2024-01-20'
    },
    {
      id: 2,
      customerName: 'Amit Kumar',
      items: [{ fabricId: 2, quantity: 1, name: 'Cotton Kurta Fabric' }],
      total: 800,
      status: 'Shipped',
      orderDate: '2024-01-19'
    }
  ]);

  const stats = [
    { label: 'Total Products', value: shopFabrics.length, icon: Package, color: 'text-blue-600' },
    { label: 'Orders Received', value: orders.length, icon: ShoppingBag, color: 'text-green-600' },
    { label: 'Shop Rating', value: '4.8', icon: Star, color: 'text-yellow-600' },
    { label: 'Total Customers', value: 156, icon: Users, color: 'text-purple-600' }
  ];

  const handleAddFabric = () => {
    const fabric = {
      id: Date.now(),
      shopId: 1,
      ...newFabric,
      price: parseFloat(newFabric.price),
      stock: parseInt(newFabric.stock),
      image: newFabric.image || 'https://images.pexels.com/photos/6069115/pexels-photo-6069115.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    setShopFabrics([...shopFabrics, fabric]);
    setNewFabric({
      name: '', price: '', stock: '', category: '', color: '', material: '', width: '', description: '', image: ''
    });
    setShowAddFabric(false);
  };

  const handleEditFabric = (fabric) => {
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

  const handleUpdateFabric = () => {
    const updatedFabrics = shopFabrics.map(f => 
      f.id === editingFabric.id 
        ? { ...f, ...newFabric, price: parseFloat(newFabric.price), stock: parseInt(newFabric.stock) }
        : f
    );
    setShopFabrics(updatedFabrics);
    setEditingFabric(null);
    setNewFabric({
      name: '', price: '', stock: '', category: '', color: '', material: '', width: '', description: '', image: ''
    });
  };

  const handleDeleteFabric = (id) => {
    setShopFabrics(shopFabrics.filter(f => f.id !== id));
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
    { id: 'products', name: 'Manage Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingBag }
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
            Shop Dashboard
          </h1>
          <p className="text-slate-600">
            Manage your fabric inventory, track orders, and grow your business
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
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
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-800">{order.customerName}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {order.items[0].name} (Qty: {order.items[0].quantity})
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">{order.orderDate}</span>
                          <span className="font-semibold text-slate-800">₹{order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {shopFabrics.slice(0, 3).map((fabric) => (
                      <div key={fabric.id} className="flex items-center space-x-3">
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Manage Products</h2>
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
                      className="flex items-center space-x-2 bg-gradient-to-r from-shop-primary to-shop-secondary text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingFabric ? 'Update Product' : 'Add Product'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopFabrics.map((fabric) => (
                  <motion.div
                    key={fabric.id}
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
                        onClick={() => handleDeleteFabric(fabric.id)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Management</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800">Order #{order.id}</h3>
                        <p className="text-slate-600">Customer: {order.customerName}</p>
                        <p className="text-sm text-slate-500">{order.orderDate}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-slate-800">
                        Total: ₹{order.total}
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-gradient-to-r from-shop-primary to-shop-secondary text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300">
                          Update Status
                        </button>
                        <button className="px-3 py-1 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopDashboard;