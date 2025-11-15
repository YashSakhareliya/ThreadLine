import api from './api';

const getAllTailors = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/tailors${queryString ? `?${queryString}` : ''}`);
};

const getTailorsByFabric = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/tailors/by-fabric${queryString ? `?${queryString}` : ''}`);
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

const sendInquiry = (tailorId, inquiryData) => {
  return api.post(`/tailors/${tailorId}/inquiries`, inquiryData);
};

const getTailorInquiries = (tailorId) => {
  return api.get(`/tailors/${tailorId}/inquiries`);
};

const replyToInquiry = (tailorId, inquiryId, replyData) => {
  return api.post(`/tailors/${tailorId}/inquiries/${inquiryId}/reply`, replyData);
};

const markInquiryAsRead = (tailorId, inquiryId) => {
  return api.patch(`/tailors/${tailorId}/inquiries/${inquiryId}/read`);
};

const closeInquiry = (tailorId, inquiryId) => {
  return api.patch(`/tailors/${tailorId}/inquiries/${inquiryId}/close`);
};

const getNearbyTailors = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/tailors/nearby${queryString ? `?${queryString}` : ''}`);
};

export default {
  getAllTailors,
  getTailorsByFabric,
  getNearbyTailors,
  getTailorById,
  createTailor,
  updateTailor,
  deleteTailor,
  addTailorReview,
  sendInquiry,
  getTailorInquiries,
  replyToInquiry,
  markInquiryAsRead,
  closeInquiry
};
