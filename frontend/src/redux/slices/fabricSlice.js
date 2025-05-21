import { createSlice } from "@reduxjs/toolkit";

const fabricSlice = createSlice({
    name: "fabric",
    initialState: {
      fabrics: [],
      selectedFabric: null,
    },
    reducers: {
      setFabrics(state, action) {
        state.fabrics = action.payload;
      },
      selectFabric(state, action) {
        state.selectedFabric = action.payload;
      },
    },
  });
  export const fabricActions = fabricSlice.actions;
  export default fabricSlice.reducer;