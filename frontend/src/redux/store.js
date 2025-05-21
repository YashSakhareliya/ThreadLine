import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import fabricReducer from "./slices/fabricSlice";
import tailorReducer from "./slices/tailorSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    fabric: fabricReducer,
    tailor: tailorReducer,
  },
});

export default store;
