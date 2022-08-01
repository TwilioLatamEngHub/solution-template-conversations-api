import {createSlice, SliceCaseReducers} from "@reduxjs/toolkit";

export const name = "auth";
const initialState = {
  accessToken: null,
  idToken: null,
  user: null,
  email: null,
  error: null,
  loading: true,
};

export type AuthSlice = Partial<typeof initialState>

const authSlice = createSlice<AuthSlice, SliceCaseReducers<AuthSlice>>({
  name,
  initialState,
  reducers: {
    setAuth(state, action) {
      state.accessToken = action.payload?.accessToken;
      state.idToken = action.payload?.idToken;
      state.user = action.payload?.user;
      state.email = action.payload?.user?.email;
      state.error = action.payload?.error;
      state.loading = false;
    },
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
