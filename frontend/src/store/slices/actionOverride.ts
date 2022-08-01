import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { put, takeEvery } from "redux-saga/effects";
import { updateApi } from "../../services/customerApi";
import { set as setAlert } from "./alert";
import { updateGlobalCustomization } from "./customer";
import {Action, DemoConfiguration} from "../types";

export const name = "action";


export type ActionOverrideState = {
  override: Action[];
  default: Action[];
  error: any | null;
  loading: boolean;
  updating: boolean;
};
const initialState: ActionOverrideState = {
  override: [],
  default: [],
  error: null,
  loading: true,
  updating: false,
};

const actionOverrideSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDefault(state, action) {
      state.default = action.payload?.actions || [];
    },
    fetched(
      state,
      action: PayloadAction<
        undefined | { actions?: Action[]; override?: unknown }
      >
    ) {
      state.loading = false;
      state.error = null;
      state.override = action.payload?.actions || state.default;
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
} = actionOverrideSlice.actions;

export default actionOverrideSlice.reducer;

interface UpdateActionOverridePayload {
  newActions: unknown;
  newDemoConfig: DemoConfiguration;
  accessToken: string;
  userApi: string;
  currentDemo: string;
}

export function* updateActionOverrideSaga(
  action: PayloadAction<UpdateActionOverridePayload>
) {
  const { newActions, newDemoConfig, accessToken, userApi, currentDemo } =
    action.payload;
  yield put(updateStart());
  console.log("saga new action override", newActions);
  console.log("saga updating demo config", newDemoConfig);
  try {
    yield updateApi(newDemoConfig, accessToken, userApi, currentDemo);

    yield put(updateSuccess({ override: newActions }));
    yield put(updateGlobalCustomization({ actionOverride: newActions }));
    yield put(
      setAlert({
        alert: {
          isActive: true,
          type: "success",
          title: "Actions were updated!",
          message: "Updating page to take effect...",
        },
      })
    );
  } catch (error) {
    console.log("error updating actions", error);
    yield put(updateFail(error));
  }
}

export function* watchActions() {
  yield takeEvery(
    actionOverrideSlice.actions.update.type,
    updateActionOverrideSaga
  );
}
