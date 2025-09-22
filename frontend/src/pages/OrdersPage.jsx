import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Eye,
  Filter,
  Search,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Loader
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { fetchOrders, fetchOrderById, clearError } from '../store/slices/ordersSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, selectedOrder, loading, error, pagination } = useSelector(state => state.orders);
  const { user } = useAuth();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt'
  });

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
    'Processing': 'bg-purple-100 text-purple-800 border-purple-200',
    'Shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcons = {
    'Pending': Clock,
    'Confirmed': CheckCircle,
    'Processing': Package,
    'Shipped': Truck,
    'Delivered': CheckCircle,
    'Cancelled': XCircle
  };

  useEffect(() => {
    if (user) {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy
      };

      if (filters.status) {
        params.status = filters.status;
      }

      dispatch(fetchOrders(params));
    }
  }, [dispatch, user, filters, pagination.page]);

  const handleOrderClick = (orderId) => {
    dispatch(fetchOrderById(orderId));
    setShowOrderDetails(true);
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchTerm) ||
        order.items.some(item => 
          item.fabric.name.toLowerCase().includes(searchTerm)
        )
      );
    }
    return true;
  });

  if (showOrderDetails && selectedOrder) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowOrderDetails(false)}
              className="flex items-center space-x-2 text-customer-primary hover:text-customer-secondary transition-colors duration-300"
            >
              <span>← Back to Orders</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="border-b border-slate-200 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedOrder.status]}`}>
                    {React.createElement(statusIcons[selectedOrder.status], { className: "w-4 h-4" })}
                    <span>{selectedOrder.status}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <p className="text-sm text-slate-600 mt-2">
                      Tracking: {selectedOrder.trackingNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex space-x-4 p-4 bg-slate-50 rounded-lg">
                    <img
                      src={item.fabric?.image}
                      alt={item.fabric?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{item.fabric?.name}</h4>
                      <p className="text-slate-600 text-sm">
                        {item.fabric?.shop?.name} • {item.fabric?.shop?.city}
                      </p>
                      <p className="text-slate-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600">
                        ₹{item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Shipping Address</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-slate-600">{selectedOrder.shippingAddress.address}</p>
                    <p className="text-slate-600">
                      {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}
                    </p>
                    <p className="text-slate-600 flex items-center space-x-2 mt-1">
                      <Phone className="w-4 h-4" />
                      <span>{selectedOrder.shippingAddress.phone}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>₹{selectedOrder.shippingCost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>₹{selectedOrder.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-800 border-t border-slate-200 pt-2">
                  <span>Total</span>
                  <span>₹{selectedOrder.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-slate-800 mb-8"
        >
          My Orders
        </motion.h1>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilter('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                  !filters.status 
                    ? 'bg-customer-primary text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Orders
              </button>
              {Object.keys(statusColors).map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    filters.status === status 
                      ? 'bg-customer-primary text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-customer-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-customer-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => {
                dispatch(clearError());
                const params = {
                  page: pagination.page,
                  limit: pagination.limit,
                  sortBy: filters.sortBy
                };
                if (filters.status) params.status = filters.status;
                dispatch(fetchOrders(params));
              }}
              className="mt-4 btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No orders found</h3>
            <p className="text-slate-500">
              {filters.status || filters.search 
                ? 'Try adjusting your filters' 
                : 'You haven\'t placed any orders yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="card cursor-pointer"
                onClick={() => handleOrderClick(order._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${statusColors[order.status]}`}>
                        {React.createElement(statusIcons[order.status], { className: "w-4 h-4" })}
                        <span>{order.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="w-4 h-4" />
                        <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.fabric?.image }
                          alt={item.fabric?.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 text-sm font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">
                      ₹{order.total.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 text-customer-primary mt-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">View Details</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const params = {
                    page: Math.max(1, pagination.page - 1),
                    limit: pagination.limit,
                    sortBy: filters.sortBy
                  };
                  if (filters.status) params.status = filters.status;
                  dispatch(fetchOrders(params));
                }}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => {
                    const params = {
                      page: index + 1,
                      limit: pagination.limit,
                      sortBy: filters.sortBy
                    };
                    if (filters.status) params.status = filters.status;
                    dispatch(fetchOrders(params));
                  }}
                  className={`px-4 py-2 border rounded-lg ${
                    pagination.page === index + 1
                      ? 'bg-customer-primary text-white border-customer-primary'
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => {
                  const params = {
                    page: Math.min(pagination.pages, pagination.page + 1),
                    limit: pagination.limit,
                    sortBy: filters.sortBy
                  };
                  if (filters.status) params.status = filters.status;
                  dispatch(fetchOrders(params));
                }}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
