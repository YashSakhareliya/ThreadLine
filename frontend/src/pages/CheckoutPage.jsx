import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { fetchCart, clearCartAsync } from '../store/slices/cartSlice';
import orderService from '../services/orderService';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount, loading, error } = useSelector(state => state.cart);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);
  
  const [addresses] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      pincode: '400001',
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      name: 'Office',
      address: '456 Business Park, Floor 3',
      city: 'Mumbai',
      pincode: '400002',
      phone: '+91 98765 43211'
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  const subtotal = totalAmount || 0;
  const shipping = 100;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const cartItems = items || [];

  const handlePayment = async () => {
    if (!cartItems.length) {
      setOrderError('Your cart is empty');
      return;
    }

    setProcessing(true);
    setOrderError(null);
    
    try {
      // Create order data
      const orderData = {
        items: cartItems.map(item => ({
          fabricId: item.fabric._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          name: addresses[selectedAddress].name,
          address: addresses[selectedAddress].address,
          city: addresses[selectedAddress].city,
          pincode: addresses[selectedAddress].pincode,
          phone: addresses[selectedAddress].phone
        },
        paymentMethod: 'razorpay',
        totalAmount: total
      };

      // Create order in backend
      const response = await orderService.createOrder(orderData);
      
      if (response.data.success) {
        // Clear cart after successful order creation
        await dispatch(clearCartAsync());
        setOrderComplete(true);
        
        setTimeout(() => {
          navigate('/customer/dashboard');
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setOrderError(error.response?.data?.message || error.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-slate-600 mb-4">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-slate-500">
            Redirecting to dashboard...
          </p>
        </motion.div>
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
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  Shipping Address
                </h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center space-x-2 text-customer-primary hover:text-customer-secondary transition-colors duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Address List */}
              <div className="space-y-3 mb-6">
                {addresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedAddress === index
                        ? 'border-customer-primary bg-customer-light'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedAddress(index)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-800">{address.name}</h4>
                        <p className="text-slate-600 mt-1">{address.address}</p>
                        <p className="text-slate-600">{address.city} - {address.pincode}</p>
                        <p className="text-slate-600">{address.phone}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-slate-400 hover:text-customer-primary">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-slate-200 pt-6"
                >
                  <h4 className="font-semibold text-slate-800 mb-4">Add New Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Address Name (Home, Office, etc.)"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Full Address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      className="input-field md:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button className="btn-primary">Save Address</button>
                    <button 
                      onClick={() => setShowAddressForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Payment Method
              </h3>
              
              <div className="space-y-3">
                <div className="p-4 border-2 border-customer-primary bg-customer-light rounded-xl">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-customer-primary" />
                    <div>
                      <h4 className="font-semibold text-slate-800">Razorpay</h4>
                      <p className="text-sm text-slate-600">Credit Card, Debit Card, UPI, Net Banking</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </motion.div>
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

              {/* Items */}
              <div className="space-y-3 mb-6">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader className="w-6 h-6 animate-spin text-customer-primary" />
                  </div>
                ) : cartItems.length === 0 ? (
                  <p className="text-slate-600 text-center py-4">Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item._id} className="flex space-x-3">
                      <img
                        src={item.fabric.image}
                        alt={item.fabric.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 text-sm">{item.fabric.name}</h4>
                        <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-xl font-bold text-slate-800 border-t border-slate-200 pt-3">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Error Message */}
              {orderError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {orderError}
                </div>
              )}

              {/* Pay Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={processing || loading || cartItems.length === 0}
                className="w-full flex items-center justify-center space-x-2 btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Place Order</span>
                  </>
                )}
              </motion.button>

              <p className="text-xs text-slate-500 text-center mt-3">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;