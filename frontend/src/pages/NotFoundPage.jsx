import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-slate-200 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/"
            className="flex items-center space-x-2 btn-primary"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 btn-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/shops"
            className="flex items-center space-x-2 text-customer-primary hover:text-customer-secondary transition-colors duration-300"
          >
            <Search className="w-5 h-5" />
            <span>Browse Shops</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;