import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tailors: [],
  filteredTailors: [],
  loading: false,
  error: null,
  filters: {
    city: '',
    specialization: '',
    experience: '',
    rating: '',
    priceRange: '',
    sortBy: 'rating'
  },
};

const tailorsSlice = createSlice({
  name: 'tailors',
  initialState,
  reducers: {
    setInitialTailors: (state, action) => {
      state.tailors = action.payload;
      state.filteredTailors = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      
      let filtered = [...state.tailors];
      
      if (state.filters.city) {
        filtered = filtered.filter(tailor => tailor.city === state.filters.city);
      }
      
      if (state.filters.specialization) {
        filtered = filtered.filter(tailor => 
          tailor.specialization.some(skill => 
            skill.toLowerCase().includes(state.filters.specialization.toLowerCase())
          )
        );
      }
      
      if (state.filters.experience) {
        const minExp = parseInt(state.filters.experience);
        filtered = filtered.filter(tailor => tailor.experience >= minExp);
      }
      
      if (state.filters.rating) {
        const minRating = parseFloat(state.filters.rating);
        filtered = filtered.filter(tailor => tailor.rating >= minRating);
      }
      
      filtered.sort((a, b) => {
        switch (state.filters.sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'experience':
            return b.experience - a.experience;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'city':
            return a.city.localeCompare(b.city);
          default:
            return 0;
        }
      });
      
      state.filteredTailors = filtered;
    },
    clearFilters: (state) => {
      state.filters = {
        city: '',
        specialization: '',
        experience: '',
        rating: '',
        priceRange: '',
        sortBy: 'rating'
      };
      state.filteredTailors = state.tailors;
    },
  },
});

export const { setInitialTailors, setFilters, clearFilters } = tailorsSlice.actions;
export default tailorsSlice.reducer;