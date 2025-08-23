import api from './api';

const getCart = () => {
  return api.get('/cart');
};

const addToCart = (fabricId, quantity) => {
  return api.post('/cart/add', { fabricId, quantity });
};

const removeFromCart = (fabricId) => {
  return api.delete(`/cart/remove/${fabricId}`);
};

const updateCartItemQuantity = (fabricId, quantity) => {
  return api.put(`/cart/update/${fabricId}`, { quantity });
};

const clearCart = () => {
  return api.delete('/cart/clear');
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
};
