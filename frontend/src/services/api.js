import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors properly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Extract the error message from backend
      let errorMessage =
        error.response.data?.message || error.message || "An error occurred";

      // Handle MongoDB duplicate key error (E11000) which occurs when registering
      // with an email that already exists (regardless of role)
      if (
        error.response.status === 500 &&
        errorMessage.toLowerCase().includes("server error during registration")
      ) {
        errorMessage = "User already exists with this email or Role";
      }

      // Handle login errors - make "Invalid credentials" more specific
      // Since backend returns "Invalid credentials" for both wrong email and wrong password,
      // we'll make it more user-friendly by showing "Wrong password or email"
      if (
        error.response.status === 401 &&
        errorMessage.toLowerCase().includes("invalid credentials")
      ) {
        errorMessage = "Wrong password or email. Please try again.";
      }

      // Set the error message properly so AuthContext can access it
      error.response.data.message = errorMessage;
    }
    return Promise.reject(error);
  }
);

export default api;
