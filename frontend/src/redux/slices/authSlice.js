import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores user information
  token: null, // Stores auth token
  isLoggedIn: false, // Tracks login status
  role: null, // Stores the user's role (e.g., customer, tailor, seller)
  loading: false, // Tracks authentication loading state
  error: null, // Tracks authentication errors
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoggedIn = true;
      state.role = user.role; // Assuming the role is part of the user object
      state.loading = false;

      // Save to localStorage for persistence
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.error; // Set error message
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.role = null;
      state.loading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("auth");
    },
    loadFromStorage: (state) => {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const { user, token } = JSON.parse(storedAuth);
        state.user = user;
        state.token = token;
        state.isLoggedIn = true;
        state.role = user.role; // Assuming the role is part of the user object
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, clearUser, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
