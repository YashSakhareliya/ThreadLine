import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Order #{order.id}</h3>
          <div className="flex items-center space-x-2 text-slate-600 mt-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="text-sm font-semibold">{order.status}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="border-t border-slate-200 pt-3">
          <h4 className="font-semibold text-slate-700 mb-2">Items:</h4>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-slate-600">Fabric Item {item.fabricId}</span>
              <span className="text-slate-800">Qty: {item.quantity} × ₹{item.price}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700">Total Amount:</span>
            <span className="text-xl font-bold text-customer-primary">
              ₹{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {order.deliveryDate && (
          <div className="text-sm text-slate-600">
            <span className="font-semibold">Delivered on:</span> {new Date(order.deliveryDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderCard;