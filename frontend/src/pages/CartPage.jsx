import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus, X, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { fetchCart, updateCartQuantityAsync, removeFromCartAsync, clearCartAsync } from '../store/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, totalItems, totalAmount, loading, error } = useSelector(state => state.cart);

  useEffect(() => {
    if (user && user.role === 'customer') {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (fabricId, quantity) => {
    dispatch(updateCartQuantityAsync({ fabricId, quantity }));
  };

  const handleRemoveItem = (fabricId) => {
    dispatch(removeFromCartAsync(fabricId));
  };

  const handleClearCart = () => {
    dispatch(clearCartAsync());
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-customer-primary" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Your cart is empty
          </h2>
          <p className="text-slate-600 mb-8">
            Start shopping to add items to your cart
          </p>
          <Link to="/fabrics" className="btn-primary">
            Browse Fabrics
          </Link>
        </motion.div>
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
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Shopping Cart
            </h1>
            <p className="text-slate-600 mt-2">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          {items.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearCart}
              disabled={loading}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-300 disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear Cart</span>
            </motion.button>
          )}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card"
                >
                  <div className="flex items-center space-x-4">
                    {/* Fabric Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.fabric?.image || 'https://via.placeholder.com/80x80'}
                        alt={item.fabric?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Fabric Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-800 truncate">
                        {item.fabric?.name}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {item.fabric?.material} • {item.fabric?.color}
                      </p>
                      <p className="text-customer-primary font-semibold">
                        ₹{item.price} per unit
                      </p>
                      <p className="text-xs text-slate-500">
                        Stock: {item.fabric?.stock} units
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.fabric._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                        className="w-8 h-8 rounded-full border border-customer-primary text-customer-primary hover:bg-customer-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.fabric._id, item.quantity + 1)}
                        disabled={item.quantity >= item.fabric?.stock || loading}
                        className="w-8 h-8 rounded-full border border-customer-primary text-customer-primary hover:bg-customer-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">
                        ₹{item.subtotal.toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.fabric._id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card sticky top-24"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{(totalAmount || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>₹100</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Tax (18%)</span>
                  <span>₹{Math.round((totalAmount || 0) * 0.18).toLocaleString()}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-slate-800">
                    <span>Total</span>
                    <span>₹{((totalAmount || 0) + 100 + Math.round((totalAmount || 0) * 0.18)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center space-x-2 btn-primary mt-6"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-4 text-center">
                <Link
                  to="/fabrics"
                  className="text-customer-primary hover:text-customer-secondary transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;