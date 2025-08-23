import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, clearCart as clearCartAction } from '../store/slices/cartSlice';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

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
  const { items: cartItems, totalItems, totalPrice } = useSelector(state => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const res = await cartService.getCart();
        dispatch(setCart(res.data.data || { items: [], totalItems: 0, totalPrice: 0 }));
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError('Failed to load cart.');
      } finally {
        setLoading(false);
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (fabricId, quantity = 1) => {
    setLoading(true);
    try {
      const res = await cartService.addToCart(fabricId, quantity);
      dispatch(setCart(res.data.data || { items: [], totalItems: 0, totalPrice: 0 }));
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (fabricId) => {
    setLoading(true);
    try {
      const res = await cartService.removeFromCart(fabricId);
      dispatch(setCart(res.data.data || { items: [], totalItems: 0, totalPrice: 0 }));
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove item from cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (fabricId, quantity) => {
    setLoading(true);
    try {
      const res = await cartService.updateCartItemQuantity(fabricId, quantity);
      dispatch(setCart(res.data.data || { items: [], totalItems: 0, totalPrice: 0 }));
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update item quantity.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await cartService.clearCart();
      dispatch(clearCartAction());
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => totalItems || 0;

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};