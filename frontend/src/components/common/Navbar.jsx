import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Search,
  Scissors,
  Store,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'customer': return 'from-customer-primary to-customer-secondary';
      case 'tailor': return 'from-tailor-primary to-tailor-secondary';
      case 'shop': return 'from-shop-primary to-shop-secondary';
      default: return 'from-customer-primary to-customer-secondary';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'customer': return <Users className="w-4 h-4" />;
      case 'tailor': return <Scissors className="w-4 h-4" />;
      case 'shop': return <Store className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'customer': return '/customer/dashboard';
      case 'tailor': return '/tailor/dashboard';
      case 'shop': return '/shop/dashboard';
      default: return '/';
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-r from-customer-primary to-customer-secondary rounded-lg flex items-center justify-center"
            >
              <Scissors className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-customer-primary to-customer-secondary bg-clip-text text-transparent">
              ThreadLine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(!user || user.role === 'customer') && (
              <>
                <Link
                  to="/shops"
                  className="text-slate-700 hover:text-customer-primary transition-colors duration-300"
                >
                  All Shops
                </Link>

                <Link
                  to="/fabrics"
                  className="text-slate-700 hover:text-customer-primary transition-colors duration-300"
                >
                  All Fabrics
                </Link>

                <Link
                  to="/tailors"
                  className="text-slate-700 hover:text-customer-primary transition-colors duration-300"
                >
                  Find Tailors
                </Link>
              </>
            )}


            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'customer' && (
                  <Link
                    to="/cart"
                    className="relative p-2 text-slate-700 hover:text-customer-primary transition-colors duration-300"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {getTotalItems() > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                      >
                        {getTotalItems()}
                      </motion.span>
                    )}
                  </Link>
                )}

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getRoleColor(user.role)} text-white shadow-lg`}
                  >
                    {getRoleIcon(user.role)}
                    <span className="capitalize">{user.role}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl py-2"
                      >
                        <Link
                          to={getDashboardPath(user.role)}
                          className="block px-4 py-2 text-slate-700 hover:bg-white/20 transition-colors duration-300"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        {user.role === 'customer' && (
                          <>
                            <Link
                              to="/orders"
                              className="block px-4 py-2 text-slate-700 hover:bg-white/20 transition-colors duration-300"
                              onClick={() => setShowUserMenu(false)}
                            >
                              My Orders
                            </Link>
                            <Link
                              to="/customer/profile"
                              className="block px-4 py-2 text-slate-700 hover:bg-white/20 transition-colors duration-300"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Profile
                            </Link>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-white/20 transition-colors duration-300 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-slate-700 hover:text-customer-primary transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-4">
              {(!user || user.role === 'customer') && (
                <>
                  <Link
                    to="/shops"
                    className="block text-slate-700 hover:text-customer-primary transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    All Shops
                  </Link>

                  <Link
                    to="/fabrics"
                    className="block text-slate-700 hover:text-customer-primary transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    All Fabrics
                  </Link>

                  <Link
                    to="/tailors"
                    className="block text-slate-700 hover:text-customer-primary transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Find Tailors
                  </Link>
                </>
              )}


              {user ? (
                <>
                  <Link
                    to={getDashboardPath(user.role)}
                    className="block text-slate-700 hover:text-customer-primary transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'customer' && (
                    <>
                      <Link
                        to="/cart"
                        className="block text-slate-700 hover:text-customer-primary transition-colors duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        Cart ({getTotalItems()})
                      </Link>
                      <Link
                        to="/orders"
                        className="block text-slate-700 hover:text-customer-primary transition-colors duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/customer/profile"
                        className="block text-slate-700 hover:text-customer-primary transition-colors duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-700 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;