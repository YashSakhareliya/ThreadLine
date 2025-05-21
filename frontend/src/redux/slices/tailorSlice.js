import { createSlice } from "@reduxjs/toolkit";
const tailorSlice = createSlice({
    name: "tailor",
    initialState: {
      tailors: [],
      selectedTailor: null,
    },
    reducers: {
      setTailors(state, action) {
        state.tailors = action.payload;
      },
      selectTailor(state, action) {
        state.selectedTailor = action.payload;
      },
    },
  });

  export const tailorActions = tailorSlice.actions;
  export default tailorSlice.reducer;