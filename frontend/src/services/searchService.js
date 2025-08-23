import api from './api';

const globalSearch = (query, type = 'all', params = {}) => {
  const searchParams = new URLSearchParams({
    q: query,
    type,
    ...params
  }).toString();
  return api.get(`/search?${searchParams}`);
};

const getSearchSuggestions = (query) => {
  return api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
};

export default {
  globalSearch,
  getSearchSuggestions
};
