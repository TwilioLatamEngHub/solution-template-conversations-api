import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import {
  actionDefaults as smsActionDefaults,
  labelDefaults as smsLabelDefaults,
  smsName,
  smsReducer,
  watchSms,
} from "@demoeng/usecase-sms-simple";

import {
  labelDefaults as optInLabelDefaults,
  optInName,
  optInReducer,
  optInSagas,
} from "@demoeng/usecase-customer-opt-in";

import { createStore } from "./store/createStore";
import {set as setSiteConfig} from './store/slices/siteConfig'
import {setAuth} from './store/slices/auth'
import {set as setAlert, dismiss as dismissAlert} from './store/slices/alert'
import {
  update as updateAction,
  setDefault as setDefaultActions,
} from './store/slices/actionOverride'
import { update as updateTheme } from './store/slices/themeOverride'
import {
  update as updateLabel,
  setDefault as setDefaultLabels,
} from './store/slices/labelOverride'
import {
  fetch as fetchCustomer,
  updateDemoConfig,
  updateCustomization,
  setDefaultCustomization,
} from './store/slices/customer'

import "./index.css";
import App from "./App";
import config from "./config/index";
import labelDefaults from "./config/labelDefaults";

export const actions = {
  setSiteConfig,
  setAuth,
  setAlert,
  dismissAlert,
  updateAction,
  updateTheme,
  updateLabel,
  fetchCustomer,
  updateDemoConfig,
  updateCustomization,
  setDefaultCustomization,
  setDefaultActions,
  setDefaultLabels,
};

const store = createStore(
  {
    [smsName]: smsReducer,
    [optInName]: optInReducer,
  },
  [watchSms, ...optInSagas]
);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

store.dispatch(actions.setSiteConfig({ ...config }));
store.dispatch(
  actions.setDefaultCustomization({
    defaultCustomization: {
      segmentEnabled: false,
      segmentKey: "",
      language: "en",
    },
  })
);

const labels = [
  ...labelDefaults.labels,
  ...smsLabelDefaults.labels,
  ...optInLabelDefaults.labels,
];

store.dispatch(actions.setDefaultLabels({ labels }));
const defaultActions = [...smsActionDefaults.actions];
store.dispatch(actions.setDefaultActions({ actions: defaultActions }));

console.log("starting store", store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById(config.packageName)
);
