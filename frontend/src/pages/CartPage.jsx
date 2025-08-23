import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartCard from '../components/cards/CartCard';

const CartPage = () => {
  const { cartItems, clearCart, totalPrice, getTotalItems } = useCart();

  if (cartItems.length === 0) {
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
          <Link to="/shops" className="btn-primary">
            Browse Shops
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
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          {cartItems.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-300"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear Cart</span>
            </motion.button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <CartCard key={item.id} item={item} />
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
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₹{(totalPrice || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>₹100</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>₹{Math.round((totalPrice || 0) * 0.18).toLocaleString()}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-slate-800">
                    <span>Total</span>
                    <span>₹{((totalPrice || 0) + 100 + Math.round((totalPrice || 0) * 0.18)).toLocaleString()}</span>
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
                  to="/shops"
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