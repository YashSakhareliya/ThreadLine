const BASE_URL = process.env.REACT_APP_BASE_URL;

// CART ENDPOINTS
export const cartEndpoints = {
  ADD_ITEM_TO_CART: BASE_URL + "/cart/addItem",
  GET_CART_BY_CUSTOMER: BASE_URL + "/cart/getCart",
  REMOVE_ITEM_FROM_CART: BASE_URL + "/cart/removeItem",
  UPDATE_ITEM_QUANTITY: BASE_URL + "/cart/updateQuantity",
  CLEAR_CART: BASE_URL + "/cart/clear",
};

// AUTH ENDPOINTS (if relevant to your project)
export const authEndpoints = {
  LOGIN: BASE_URL + "/auth/login",
  SIGNUP: BASE_URL + "/auth/register",
};

// PROFILE ENDPOINTS (if applicable)
export const profileEndpoints = {
  GET_USER_PROFILE: BASE_URL + "/profile/getProfile",
  UPDATE_PROFILE: BASE_URL + "/profile/updateProfile",
};

// FABRIC MANAGEMENT ENDPOINTS
export const fabricEndpoints = {
  ADD_FABRIC:BASE_URL+"/fabric/",
  GET_ALL_FABRICS: BASE_URL + "/fabric/getAllFabrics",
  GET_FABRIC_DETAILS: BASE_URL + "/fabric/getFabricDetails",
};

// TAILOR MANAGEMENT ENDPOINTS
export const tailorEndpoints = {
  GET_ALL_TAILORS: BASE_URL + "/tailor/getAllTailors",
  GET_TAILOR_DETAILS: BASE_URL + "/tailor/getTailorDetails",
};
