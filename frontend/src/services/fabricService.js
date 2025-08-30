import api from './api';

const getAllFabrics = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/fabrics${queryString ? `?${queryString}` : ''}`);
};

const getFabricsByShop = (shopId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/shops/${shopId}/fabrics${queryString ? `?${queryString}` : ''}`);
};

const getFabricById = (id) => {
  return api.get(`/fabrics/${id}`);
};

const createFabric = (shopId, fabricData) => {
  return api.post(`/shops/${shopId}/fabrics`, fabricData);
};

const updateFabric = (id, fabricData) => {
  return api.put(`/fabrics/${id}`, fabricData);
};

const deleteFabric = (id) => {
  return api.delete(`/fabrics/${id}`);
};

const addFabricReview = (fabricId, reviewData) => {
  return api.post(`/fabrics/${fabricId}/reviews`, reviewData);
};

export default {
  getAllFabrics,
  getFabricsByShop,
  getFabricById,
  createFabric,
  updateFabric,
  deleteFabric,
  addFabricReview
};
