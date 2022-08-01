import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { put, takeEvery } from "redux-saga/effects";

import { updateApi } from "../../services/customerApi";
import { set as setAlert } from "./alert";
import { updateGlobalCustomization } from "./customer";
import {DemoConfiguration} from "../types";

export const name = "theme";
export type ThemeOverrideState = {
  override?: {}
  error: null | unknown
  updating: boolean
  computing: boolean
}
const initialState: ThemeOverrideState = {
  override: {},
  error: null,
  updating: false,
  computing: false,
};

const themeOverrideSlice = createSlice({
  name,
  initialState,
  reducers: {
    fetched(state, action: PayloadAction<undefined | {override: {}}>) {
      state.error = null;
      state.override = action.payload?.override;
    },
    computedTheme(state) {
      state.error = null;
      state.computing = false;
    },
    computeStart(state) {
      state.computing = true;
    },
    computeFail(state, action) {
      state.computing = false;
      state.error = action.payload?.error;
    },
    update() {},
    updateStart(state) {
      state.updating = true;
      state.error = null;
    },
    updateSuccess(state, action) {
      state.override = action.payload?.override;
      state.error = null;
      state.updating = false;
    },
    updateFail(state, action) {
      state.updating = false;
      state.error = action.payload?.error;
    },
  },
});

export const {
  fetched,
  computeStart,
  computeFail,
  computedTheme,
  update,
  updateStart,
  updateSuccess,
  updateFail,
} = themeOverrideSlice.actions;

export default themeOverrideSlice.reducer;

interface UpdateThemePayload {
  newTheme: unknown
  newDemoConfig: DemoConfiguration
  accessToken: string
  userApi: string
  currentDemo: string
}
export function* updateThemeSaga(action: PayloadAction<UpdateThemePayload>) {
  const { newTheme, newDemoConfig, accessToken, userApi, currentDemo } =
    action.payload;
  yield put(updateStart());
  console.log("saga new theme override", newTheme);
  try {
    yield updateApi(newDemoConfig, accessToken, userApi, currentDemo);
    yield put(updateSuccess({ override: newTheme }));
    yield put(updateGlobalCustomization({ themeOverride: newTheme }));
    yield put(
      setAlert({
        alert: {
          isActive: true,
          type: "success",
          title: "Theme was updated!",
          message: "Updating page to take effect...",
        },
      })
    );
  } catch (error) {
    yield put(updateFail({ error }));
  }
}

export function* watchTheme() {
  const { update } = themeOverrideSlice.actions;
  yield takeEvery(update.type, updateThemeSaga);
}
