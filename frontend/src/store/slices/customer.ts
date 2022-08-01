import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  updateApi,
  fetchCustomer,
  fetchSpecificDemoConfig,
} from "../../services/customerApi";
import { fetched as fetchedAction } from "./actionOverride";
import { fetched as fetchedTheme } from "./themeOverride";
import { fetched as fetchedLabel } from "./labelOverride";
import { set as setAlert } from "./alert";
import {DemoConfiguration, Customer, Customization} from "../types";

export const name = "customer";
export interface CustomerState {
  customer?: {}
  customization?: {}
  demoConfig?: {}
  demoData?: {}
  defaultCustomization?: any
  error?: any
  loading?: boolean
}
const initialState: CustomerState = {
  customer: {},
  customization: {},
  demoConfig: {},
  demoData: {},
  defaultCustomization: null,
  error: null,
  loading: true,
};

const customerSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDefaultCustomization(state, action) {
      state.defaultCustomization = action.payload?.defaultCustomization;
    },
    updateGlobalCustomization(state, action) {
      state.customization = { ...state.customization, ...action.payload };
    },
    fetch() {},
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action) {
      console.log("fetch customer success", action);
      let customer = { ...action.payload.customer };
      let customization = { ...action.payload.customization };
      let demoConfig = { ...action.payload.customer.demoConfig };

      delete customer.demoConfig;
      delete demoConfig.currentDemoCustomization;
      delete demoConfig.jCurrentCustomization;
      delete demoConfig.customizations;
      let demoData = {
        demoData: { ...action.payload.customization },
        customer: { ...customer },
      };
      delete demoData.demoData.themeOverride;
      delete demoData.demoData.actionOverride;
      delete demoData.demoData.labelOverride;

      state.customer = customer;
      state.customization = customization;
      state.demoConfig = demoConfig;
      state.demoData = demoData;
      state.error = null;
      state.loading = false;
    },
    fetchFail(state, action) {
      state.error = action.payload?.error;
      state.loading = false;
    },
    updateDemoConfig() {},
    updateDemoConfigStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateDemoConfigSuccess(state, action) {
      let demoConfig = action.payload.demoConfig;
      delete demoConfig.currentDemoCustomization;
      delete demoConfig.jCurrentCustomization;
      delete demoConfig.customizations;
      state.demoConfig = demoConfig;
      state.error = null;
      state.loading = false;
    },
    updateDemoConfigFail(state, action) {
      state.error = action.payload?.error;
      state.loading = false;
    },
    updateCustomization() {},
    updateCustomizationStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateCustomizationSuccess(state, action) {
      state.customization = action.payload.customization;
      state.error = null;
      state.loading = false;
    },
    updateCustomizationFail(state, action) {
      state.error = action.payload?.error;
      state.loading = false;
    },
  },
});

export const {
  setDefaultCustomization,
  updateGlobalCustomization,
  fetch,
  fetchStart,
  fetchSuccess,
  fetchFail,
  updateDemoConfig,
  updateDemoConfigStart,
  updateDemoConfigSuccess,
  updateDemoConfigFail,
  updateCustomization,
  updateCustomizationStart,
  updateCustomizationSuccess,
  updateCustomizationFail,
} = customerSlice.actions;
export default customerSlice.reducer;

export function* fetchCustomerSaga(action: PayloadAction<CustomerApiPayload>) {
  yield put(fetchStart());
  yield customerApi(action.payload);
}

interface UpdateDemoConfigPayload {
  id: string | number;
  accessToken: string;
  userApi: string;
  currentDemo: unknown
}
export function* updateDemoConfigSaga(action: PayloadAction<UpdateDemoConfigPayload>) {
  yield put(updateDemoConfigStart());
  const { id, accessToken, userApi, currentDemo } = action.payload;
  const body = {
    activeDemo: currentDemo,
    id,
  };
  console.log("update customer saga", action);
  try {
    const demoConfig: DemoConfiguration = yield call(updateApi, body, accessToken, userApi);
    console.log("setting updated customer", demoConfig);
    yield put(updateDemoConfigSuccess({ demoConfig }));
  } catch (error) {
    yield put(updateDemoConfigFail({ error }));
  }
}

interface CustomerApiPayload {
  accessToken: string;
  email: string;
  userApi: string;
  currentDemo: string;
}
function* customerApi(payload: CustomerApiPayload) {
  const { accessToken, email, userApi, currentDemo } = payload;
  try {
    let customer: Customer = yield call(fetchCustomer, userApi, accessToken, email);

    console.debug("setting customer", customer);

    let currentCustomization: Customization = {};
    //if their activeDemo is set correctly, we have our config
    //otherwise fetch by current demo name
    if (
      customer.demoConfig &&
      customer.demoConfig.activeDemo === currentDemo &&
      customer.demoConfig.jCurrentCustomization
    ) {
      currentCustomization = customer.demoConfig.jCurrentCustomization;
    } else {
      console.debug("fetching specific demo config", currentDemo);
      const configResponse: DemoConfiguration = yield call(
        fetchSpecificDemoConfig,
        customer,
        accessToken,
        userApi,
        currentDemo
      );

      currentCustomization = configResponse.jCurrentCustomization!;
    }
    console.debug("using current demo config", currentCustomization);

    if (currentCustomization?.themeOverride) {
      console.log("setting fetched theme");
      yield put(fetchedTheme({ override: currentCustomization.themeOverride }));
    } else {
      yield put(fetchedTheme());
    }

    if (currentCustomization?.actionOverride) {
      console.log(
        "setting fetched actions",
        currentCustomization.actionOverride
      );
      yield put(
        fetchedAction({ override: currentCustomization.actionOverride })
      );
    } else {
      console.log("setting default actions from fetched");
      yield put(fetchedAction());
    }
    if (currentCustomization?.labelOverride) {
      console.log("setting fetched labels", currentCustomization.labelOverride);
      yield put(fetchedLabel({ override: currentCustomization.labelOverride }));
    } else {
      yield put(fetchedLabel());
    }
    console.log("setting customer");
    yield put(
      fetchSuccess({
        customer,
        customization: currentCustomization,
      })
    );
    console.log("completed customer saga");
  } catch (error) {
    yield put(fetchFail({ error: error }));
  }
}

interface UpdateCustomizationPayload {
  newCustomization: unknown
  newDemoConfig: DemoConfiguration
  accessToken: string
  userApi: string
  currentDemo: string
}
export function* updateCustomizationSaga(action: PayloadAction<UpdateCustomizationPayload>) {
  const { newCustomization, newDemoConfig, accessToken, userApi, currentDemo } =
    action.payload;
  yield put(updateCustomizationStart());
  console.log(
    "saga new customization override",
    newCustomization,
    newDemoConfig
  );
  try {
    yield call(updateApi, newDemoConfig, accessToken, userApi, currentDemo);

    yield put(updateCustomizationSuccess({ customization: newCustomization }));
    yield put(
      setAlert({
        alert: {
          isActive: true,
          type: "success",
          title: "Customizations were updated!",
          message: "Updating page to take effect...",
        },
      })
    );
  } catch (err) {
    yield put(updateCustomizationFail(err));
  }
}

export function* watchCustomer() {
  yield takeEvery(updateDemoConfig.type, updateDemoConfigSaga);
  yield takeEvery(fetch.type, fetchCustomerSaga);
  yield takeEvery(updateCustomization.type, updateCustomizationSaga);
}
