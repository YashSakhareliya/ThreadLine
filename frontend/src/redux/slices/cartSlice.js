import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    },
    reducers: {
      addItemToCart(state, action) {
        const newItem = action.payload;
        const existingItem = state.items.find(item => item.id === newItem.id);
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
          existingItem.totalPrice += newItem.price * newItem.quantity;
        } else {
          state.items.push({
            ...newItem,
            totalPrice: newItem.price * newItem.quantity,
          });
        }
        state.totalQuantity += newItem.quantity;
        state.totalPrice += newItem.price * newItem.quantity;
      },
      removeItemFromCart(state, action) {
        const id = action.payload;
        const existingItem = state.items.find(item => item.id === id);
        if (existingItem) {
          state.totalQuantity -= existingItem.quantity;
          state.totalPrice -= existingItem.totalPrice;
          state.items = state.items.filter(item => item.id !== id);
        }
      },
      clearCart(state) {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
      },
    },
  });
  export const cartActions = cartSlice.actions;
  export default cartSlice.reducer;