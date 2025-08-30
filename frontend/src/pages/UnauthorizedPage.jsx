import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Home, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-slate-800 mb-4">403</h1>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Access Denied</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            You don't have permission to access this page. Please check your account role or contact support.
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
        </motion.div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;