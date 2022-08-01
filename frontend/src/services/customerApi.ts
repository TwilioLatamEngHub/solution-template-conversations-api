import axios from "axios";
import { Customer, DemoConfiguration } from "../store/types";

function formatHeaders(authToken: string) {
  return {
    Authorization: "Bearer " + authToken,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export function fetchCustomer(
  userApi: string,
  authToken: string,
  email: string
): Promise<Customer> {
  const headers = formatHeaders(authToken);
  return axios
    .get(
      `${userApi}Customer?email=${encodeURIComponent(
        email.replace("+flex", "").replace("+demo", "")
      )}`,
      {
        headers,
      }
    )
    .then((response) => response.data);
}

export function updateApi(
  demoConfig: DemoConfiguration,
  authToken: string,
  userApi: string,
  currentDemo?: string
): Promise<DemoConfiguration> {
  let url = `${userApi}DemoConfiguration/${demoConfig.id}`;
  if (currentDemo) url += "/" + currentDemo;
  const headers = formatHeaders(authToken);
  return axios
    .put(url, demoConfig, {
      headers,
    })
    .then((response) => response.data);
}

// TODO: find out why this is a generator
export function* fetchSpecificDemoConfig(
  customer: Customer,
  authToken: string,
  userApi: string,
  currentDemo: string
): Generator<never, Promise<DemoConfiguration>, unknown> {
  const headers = formatHeaders(authToken);
  return axios
    .get(`${userApi}DemoConfiguration/${customer.id}/${currentDemo}`, {
      headers,
    })
    .then((response) => response.data);
}
