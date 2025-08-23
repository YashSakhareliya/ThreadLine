import api from './api';

const getMyOrders = () => {
  return api.get('/orders');
};

const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export default {
  getMyOrders,
  getOrderById,
  createOrder
};
