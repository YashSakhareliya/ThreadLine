import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Palette, Ruler } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const FabricCard = ({ fabric }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (user && user.role === 'customer') {
      dispatch(addToCart({ fabric, quantity: 1 }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card group"
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={fabric.image || fabric.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={fabric.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-slate-700">₹{fabric.price}</span>
        </div>
        {fabric.stock < 10 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            Low Stock
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Link to={`/fabric/${fabric._id}`}>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-customer-primary transition-colors duration-300 cursor-pointer">
            {fabric.name}
          </h3>
        </Link>
        
        <p className="text-slate-600 text-sm line-clamp-2">
          {fabric.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2 text-slate-600">
            <Palette className="w-4 h-4 text-customer-primary" />
            <span>{fabric.color}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-600">
            <Package className="w-4 h-4 text-customer-primary" />
            <span>{fabric.stock} units</span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-600">
            <Ruler className="w-4 h-4 text-customer-primary" />
            <span>{fabric.specifications?.width || fabric.width || 'N/A'}</span>
          </div>
          
          <div className="text-slate-600">
            <span className="font-semibold">{fabric.material}</span>
          </div>
        </div>

        {user && user.role === 'customer' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={fabric.stock === 0}
            className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{fabric.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default FabricCard;