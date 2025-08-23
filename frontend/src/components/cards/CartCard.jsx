import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const CartCard = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item._id || item.fabricId);
    } else {
      updateQuantity(item._id || item.fabricId, newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="card flex flex-col md:flex-row gap-4"
    >
      <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden">
        <img
          src={item.image || item.fabric?.image || '/placeholder.svg'}
          alt={item.name || item.fabric?.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-slate-800">{item.name || item.fabric?.name}</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeFromCart(item._id || item.fabricId)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="text-sm text-slate-600 space-y-1">
          <p>Color: {item.color || item.fabric?.color}</p>
          <p>Material: {item.material || item.fabric?.material}</p>
          <p>Width: {item.width || item.fabric?.specifications?.width || 'N/A'}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors duration-300"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            
            <span className="w-12 text-center font-semibold">{item.quantity}</span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-slate-800">
              ₹{((item.price || item.fabric?.price || 0) * item.quantity).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">
              ₹{item.price || item.fabric?.price || 0} each
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartCard;