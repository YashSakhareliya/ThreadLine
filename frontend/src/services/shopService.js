import api from './api';

const getAllShops = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/shops${queryString ? `?${queryString}` : ''}`);
};

const getShopById = (id) => {
  return api.get(`/shops/${id}`);
};

const createShop = (shopData) => {
  return api.post('/shops', shopData);
};

const updateShop = (id, shopData) => {
  return api.put(`/shops/${id}`, shopData);
};

const deleteShop = (id) => {
  return api.delete(`/shops/${id}`);
};

export default {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop
};
