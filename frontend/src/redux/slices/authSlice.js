import { createSlice } from "@reduxjs/toolkit";

const getAuthFromStorage = () => {
  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    const { user, token } = JSON.parse(storedAuth);
    // If we found data, return it to be used as the initial state.
    return { user, token, isLoading: false, error: null };
  }
  // If no data, return the default empty state.
  return { user: null, token: null, isLoading: false, error: null };
};

// const initialState = getAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState: getAuthFromStorage(),
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
