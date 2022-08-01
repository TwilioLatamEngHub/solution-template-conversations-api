import React from "react";
import { cleanup, render } from "@testing-library/react";
import * as ReactRedux from "react-redux";
import App from "./App";
import {RootState} from "./index";

const useSelectorMock = jest.spyOn(ReactRedux, "useSelector");
const useDispatchMock = jest.spyOn(ReactRedux, "useDispatch");
const dispatchMock = jest.fn();
useDispatchMock.mockImplementation(() => dispatchMock);

beforeEach(() => jest.clearAllMocks());
afterEach(() => {
  cleanup();
});

const defaultMockStore: Partial<RootState> = {
  auth: {},
  customer: {},
  siteConfig: {
    syncStorageApi: "",
    currentDemo: "",
    friendlyName: "",
    gaToken: "",
    languages: [],
    oktaClientId: "",
    oktaDomain: "",
    talonsApi: "",
    themes: [],
    userApi: "",
  },
  customerOptIn: {
    customers: [],
  },
};

const useSelectorMockImplementation =
  (mockStore: typeof defaultMockStore) =>
  (selector: (m: typeof defaultMockStore) => any) =>
    selector(mockStore);

test("renders learn react link", () => {
  useSelectorMock.mockImplementation(
    useSelectorMockImplementation(defaultMockStore)
  );
  const { getByText } = render(<App />);
  const linkElement = getByText(/Solutions Template/i);
  expect(linkElement).toBeInTheDocument();
});
