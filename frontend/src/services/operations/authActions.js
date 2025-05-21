import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../apis";
import { setUser, clearUser } from "../../redux/slices/authSlice";

// Signup Action
export const signupUser = (formData, navigate) => async (dispatch) => {
  try {
    const response = await apiConnector("POST", authEndpoints.SIGNUP, formData);
    dispatch(setUser({ user: response.data.user, token: response.data.token }));
    alert("Signup successful!");
    navigate("/home"); // Navigate to home after signup
  } catch (error) {
    console.error("Signup Error:", error);
    alert(error.response?.data?.message || "Signup failed!");
  }
};

// Login Action
export const loginUser = (formData, navigate) => async (dispatch) => {
  try {
    const response = await apiConnector("POST", authEndpoints.LOGIN, formData);
    dispatch(setUser({ user: response.data.user, token: response.data.token }));
    alert("Login successful!");
    navigate(response.data.user.role === "customer" ? "/home" : `/${response.data.user.role}-dashboard`);
  } catch (error) {
    console.error("Login Error:", error);
    alert(error.response?.data?.message || "Login failed!");
  }
};

// Logout Action
export const logoutUser = () => (dispatch) => {
  dispatch(clearUser());
  alert("Logged out successfully!");
};
