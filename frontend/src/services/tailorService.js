import api from './api';

const getAllTailors = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/tailors${queryString ? `?${queryString}` : ''}`);
};

const getTailorById = (id) => {
  return api.get(`/tailors/${id}`);
};

const createTailor = (tailorData) => {
  return api.post('/tailors', tailorData);
};

const updateTailor = (id, tailorData) => {
  return api.put(`/tailors/${id}`, tailorData);
};

const deleteTailor = (id) => {
  return api.delete(`/tailors/${id}`);
};

const addTailorReview = (tailorId, reviewData) => {
  return api.post(`/tailors/${tailorId}/reviews`, reviewData);
};

export default {
  getAllTailors,
  getTailorById,
  createTailor,
  updateTailor,
  deleteTailor,
  addTailorReview
};
