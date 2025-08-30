import api from './api';

const getMyOrders = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/orders${queryString ? `?${queryString}` : ''}`);
};

const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

const getShopOrders = (shopId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/shops/${shopId}/orders${queryString ? `?${queryString}` : ''}`);
};

const updateOrderStatus = (orderId, status) => {
  return api.put(`/orders/${orderId}/status`, { status });
};

export default {
  getMyOrders,
  getOrderById,
  createOrder,
  getShopOrders,
  updateOrderStatus
};
