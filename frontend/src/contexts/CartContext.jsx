import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  addToCartAsync, 
  updateCartQuantityAsync, 
  removeFromCartAsync, 
  clearCartAsync 
} from '../store/slices/cartSlice';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, totalItems, totalAmount, loading, error } = useSelector(state => state.cart);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const addToCart = async (fabricId, quantity = 1) => {
    return dispatch(addToCartAsync({ fabricId, quantity }));
  };

  const removeFromCart = async (fabricId) => {
    return dispatch(removeFromCartAsync(fabricId));
  };

  const updateQuantity = async (fabricId, quantity) => {
    return dispatch(updateCartQuantityAsync({ fabricId, quantity }));
  };

  const clearCart = async () => {
    return dispatch(clearCartAsync());
  };

  const getTotalItems = () => totalItems || 0;
  const getTotalPrice = () => totalAmount || 0;

  const value = {
    cartItems: items || [],
    totalItems: totalItems || 0,
    totalPrice: totalAmount || 0,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};