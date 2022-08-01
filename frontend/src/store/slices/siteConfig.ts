import { createSlice } from "@reduxjs/toolkit";

export const name = "siteConfig";
const initialState = {};

const siteConfigSlice = createSlice({
  name,
  initialState,
  reducers: {
    set(state, action) {
      return action.payload;
    },
  },
});

export const { set } = siteConfigSlice.actions;
export default siteConfigSlice.reducer;
