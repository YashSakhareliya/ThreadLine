import api from './api';

// Get customer profile
const getCustomerProfile = async () => {
  const response = await api.get('/customers/profile');
  return response.data;
};

// Update customer profile
const updateCustomerProfile = async (profileData) => {
  const response = await api.put('/customers/profile', profileData);
  return response.data;
};

// Add address
const addAddress = async (addressData) => {
  const response = await api.post('/customers/addresses', addressData);
  return response.data;
};

// Update address
const updateAddress = async (addressId, addressData) => {
  const response = await api.put(`/customers/addresses/${addressId}`, addressData);
  return response.data;
};

// Delete address
const deleteAddress = async (addressId) => {
  const response = await api.delete(`/customers/addresses/${addressId}`);
  return response.data;
};

// Add shop to favorites
const addFavoriteShop = async (shopId) => {
  const response = await api.post(`/customers/favorites/shops/${shopId}`);
  return response.data;
};

// Remove shop from favorites
const removeFavoriteShop = async (shopId) => {
  const response = await api.delete(`/customers/favorites/shops/${shopId}`);
  return response.data;
};

// Add tailor to favorites
const addFavoriteTailor = async (tailorId) => {
  const response = await api.post(`/customers/favorites/tailors/${tailorId}`);
  return response.data;
};

// Remove tailor from favorites
const removeFavoriteTailor = async (tailorId) => {
  const response = await api.delete(`/customers/favorites/tailors/${tailorId}`);
  return response.data;
};

// Get dashboard stats
const getDashboardStats = async () => {
  const response = await api.get('/customers/dashboard');
  return response.data;
};

export default {
  getCustomerProfile,
  updateCustomerProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addFavoriteShop,
  removeFavoriteShop,
  addFavoriteTailor,
  removeFavoriteTailor,
  getDashboardStats
};
