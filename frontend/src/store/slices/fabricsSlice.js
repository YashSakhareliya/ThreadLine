import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fabrics: [],
  filteredFabrics: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    priceRange: '',
    color: '',
    material: '',
    city: '',
    sortBy: 'name'
  },
};

const fabricsSlice = createSlice({
  name: 'fabrics',
  initialState,
  reducers: {
    setInitialFabrics: (state, action) => {
      state.fabrics = action.payload;
      state.filteredFabrics = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      
      // Apply filters
      let filtered = [...state.fabrics];
      
      if (state.filters.category) {
        filtered = filtered.filter(fabric => fabric.category === state.filters.category);
      }
      
      if (state.filters.priceRange) {
        const [min, max] = state.filters.priceRange.split('-').map(Number);
        filtered = filtered.filter(fabric => {
          if (max) {
            return fabric.price >= min && fabric.price <= max;
          } else {
            return fabric.price >= min;
          }
        });
      }
      
      if (state.filters.color) {
        filtered = filtered.filter(fabric => 
          fabric.color.toLowerCase().includes(state.filters.color.toLowerCase())
        );
      }
      
      if (state.filters.material) {
        filtered = filtered.filter(fabric => 
          fabric.material.toLowerCase().includes(state.filters.material.toLowerCase())
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (state.filters.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'stock':
            return b.stock - a.stock;
          default:
            return 0;
        }
      });
      
      state.filteredFabrics = filtered;
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: '',
        color: '',
        material: '',
        city: '',
        sortBy: 'name'
      };
      state.filteredFabrics = state.fabrics;
    },
  },
});

export const { setInitialFabrics, setFilters, clearFilters } = fabricsSlice.actions;
export default fabricsSlice.reducer;