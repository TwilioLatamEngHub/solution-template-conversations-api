import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { put, takeEvery } from "redux-saga/effects";
import { updateApi } from "../../services/customerApi";
import { set as setAlert } from "./alert";
import { updateGlobalCustomization } from "./customer";
import {DemoConfiguration, Label} from "../types";

export const name = "label";

type LabelOverrideState = {
  override: Label[]
  default: Label[]
  error: null | unknown
  loading: boolean
  updating: boolean
}
const initialState: LabelOverrideState = {
  override: [],
  default: [],
  error: null,
  loading: true,
  updating: false,
};

const labelOverrideSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDefault(state, action) {
      state.default = action.payload?.labels;
    },
    fetched(state, action: PayloadAction<undefined | {labels?: Label[], override?: Label[]}>) {
      state.loading = false;
      state.error = null;
      state.override = action.payload?.labels || state.default;
    },
    update(state) {
      state.updating = true;
    },
    updateStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateSuccess(state, action) {
      state.override = action.payload.override;
      state.error = null;
      state.loading = false;
    },
    updateFail(state, action) {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  setDefault,
  fetched,
  update,
  updateStart,
  updateSuccess,
  updateFail,
} = labelOverrideSlice.actions;

export default labelOverrideSlice.reducer;

interface UpdateLabelOverridePayload {
  newLabel: unknown
  newDemoConfig: DemoConfiguration
  accessToken: string
  userApi: string
  currentDemo: string
}
export function* updateLabelOverrideSaga(action: PayloadAction<UpdateLabelOverridePayload>) {
  const { newLabel, newDemoConfig, accessToken, userApi, currentDemo } =
    action.payload;
  yield put(updateStart());
  console.log("saga new label override", newLabel);
  console.log("saga updating demo config", newDemoConfig);
  try {
    yield updateApi(newDemoConfig, accessToken, userApi, currentDemo);

    yield put(updateSuccess({ override: newLabel }));
    yield put(updateGlobalCustomization({ labelOverride: newLabel }));
    yield put(
      setAlert({
        alert: {
          isActive: true,
          type: "success",
          title: "Labels were updated!",
          message: "Updating page to take effect...",
        },
      })
    );
  } catch (error) {
    yield put(updateFail(error));
  }
}

export function* watchLabel() {
  yield takeEvery(
    labelOverrideSlice.actions.update.type,
    updateLabelOverrideSaga
  );
}
