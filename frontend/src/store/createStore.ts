import { configureStore, ReducersMapObject } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import createSagaMiddleware, { Saga } from "redux-saga";

import siteConfigReducer, {
  name as siteReducerName,
} from "./slices/siteConfig";
import authReducer, { name as authReducerName } from "./slices/auth";
import alertReducer, { name as alertReducerName } from "./slices/alert";
import customerReducer, {
  name as customerReducerName,
  watchCustomer,
} from "./slices/customer";
import themeReducer, {
  name as themeReducerName,
  watchTheme,
} from "./slices/themeOverride";
import labelReducer, {
  name as labelReducerName,
  watchLabel,
} from "./slices/labelOverride";
import actionOverrideReducer, {
  name as actionOverrideName,
  watchActions,
} from "./slices/actionOverride";

const defaultReducers = {
  [siteReducerName]: siteConfigReducer,
  [authReducerName]: authReducer,
  [themeReducerName]: themeReducer,
  [labelReducerName]: labelReducer,
  [customerReducerName]: customerReducer,
  [alertReducerName]: alertReducer,
  [actionOverrideName]: actionOverrideReducer,
};

const coreSagas = [watchCustomer, watchLabel, watchTheme, watchActions];

export function createStore<S>(
  customReducers: ReducersMapObject<S>,
  customSagas: Saga[]
) {
  const rootReducer = combineReducers({
    ...defaultReducers,
    ...customReducers,
  });

  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: false,
      }).concat(middlewares),
    devTools: true,
    //preloadedState -- should we cache customer, customization state?
  });

  coreSagas?.forEach((saga) => sagaMiddleware.run(saga));
  customSagas?.forEach((saga) => sagaMiddleware.run(saga));
  console.debug("providing default store", store);
  return store;
}

//export { create as createStore };
