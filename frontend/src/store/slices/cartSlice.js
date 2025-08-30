import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ fabricId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(fabricId, quantity);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ fabricId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItemQuantity(fabricId, quantity);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (fabricId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(fabricId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  lastUpdated: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.error = null;
      state.lastUpdated = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update quantity
      .addCase(updateCartQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(updateCartQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear cart
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;