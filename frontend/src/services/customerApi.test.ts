import "regenerator-runtime/runtime";
import axios from "axios";
import { fetchCustomer } from "./customerApi";

const email = "trobinson@twilio.com";
const authToken = "ey123";
const userApi = "https://api.owldemo.com/api/";

jest.mock("axios");
describe("Customer Api axios calls", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should accept the url from userApi", async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ data: {} });
    await fetchCustomer(userApi, authToken, email);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(userApi),
      expect.anything()
    );
  });

  it("should accept add auth token to headers", async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ data: {} });
    await fetchCustomer(userApi, authToken, email);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer " + authToken,
          Accept: expect.anything(),
          "Content-Type": expect.anything(),
        },
      })
    );
  });

  it("should modify the email for lookup", async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ data: {} });
    const testEmail = "trobinson+demo@twilio.com";
    await fetchCustomer(userApi, authToken, testEmail);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(email)),
      expect.anything()
    );
  });
});
