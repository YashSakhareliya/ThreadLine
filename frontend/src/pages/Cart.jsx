import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Minus, Plus, X, Scissors } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [availableTailors, setAvailableTailors] = useState([]);
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchCartItems();
    fetchAvailableTailors();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      setError('Failed to load cart items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTailors = async () => {
    try {
      const response = await axios.get('/api/tailors');
      setAvailableTailors(response.data);
    } catch (error) {
      console.error('Failed to load tailors:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/api/cart/update',
        { itemId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      setError('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      setError('Failed to remove item. Please try again.');
    }
  };

  const selectTailor = async (itemId, tailorId) => {
    try {
      const token = localStorage.getItem('token');
      const selectedTailor = availableTailors.find(t => t.id === tailorId);

      if (!selectedTailor) return;

      await axios.put(
        '/api/cart/update',
        {
          itemId,
          tailorId,
          tailorFee: selectedTailor.price
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, tailorId, tailorFee: selectedTailor.price }
            : item
        )
      );
      setShowTailorModal(false);
    } catch (error) {
      setError('Failed to select tailor. Please try again.');
    }
  };

  const applyPromoCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/cart/promo',
        { code: promoCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscount(response.data.discount);
    } catch (error) {
      setError('Invalid promo code. Please try again.');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + itemTotal + (item.tailorFee || 0);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05; // 5% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax - discount;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/fabrics')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.type}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.tailorId ? (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Tailor Fee: ${item.tailorFee}</p>
                        <button
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setShowTailorModal(true);
                          }}
                          className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <Scissors className="w-4 h-4 mr-1" />
                          Change Tailor
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setShowTailorModal(true);
                        }}
                        className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        <Scissors className="w-4 h-4 mr-1" />
                        Add Tailor
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="text-gray-900">${calculateTax().toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-medium text-gray-900">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="pt-4">
                    <label htmlFor="promo" className="block text-sm font-medium text-gray-700">
                      Promo Code
                    </label>
                    <div className="mt-1 flex space-x-2">
                      <input
                        type="text"
                        id="promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter code"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => navigate('/fabrics')}
                    className="w-full text-indigo-600 bg-white border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tailor Selection Modal */}
        {showTailorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Select a Tailor</h3>
                <button
                  onClick={() => setShowTailorModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {availableTailors.map(tailor => (
                  <button
                    key={tailor.id}
                    onClick={() => selectTailor(selectedItemId, tailor.id)}
                    className="w-full text-left p-4 border rounded-lg hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{tailor.name}</h4>
                        <p className="text-sm text-gray-500">{tailor.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${tailor.price}</p>
                        <div className="flex items-center text-yellow-400">
                          {Array.from({ length: Math.floor(tailor.rating) }).map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
