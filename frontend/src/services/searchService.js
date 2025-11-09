import api from './api';

const globalSearch = (query, type = 'all', params = {}) => {
  const searchParams = new URLSearchParams({
    q: query,
    type,
    ...params
  }).toString();
  return api.get(`/search?${searchParams}`);
};

const nearbySearch = (query, type = 'all', filters = {}) => {
  const searchParams = new URLSearchParams({
    q: query,
    type,
    ...filters
  }).toString();
  return api.get(`/search/nearby?${searchParams}`);
};

const getSearchSuggestions = (query) => {
  return api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
};

const getAllCities = () => {
  return api.get('/search/cities');
};

export default {
  globalSearch,
  nearbySearch,
  getSearchSuggestions,
  getAllCities
};
