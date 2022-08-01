import { createSlice } from "@reduxjs/toolkit";

export const name = "alert";
const initialState = {
  alert: null,
};

const alertSlice = createSlice({
  name,
  initialState,
  reducers: {
    set(state, action) {
      state.alert = action.payload.alert;
    },
    dismiss(state) {
      state.alert = null;
    },
  },
});

export const { set, dismiss } = alertSlice.actions;
export default alertSlice.reducer;
