export default {
  currentDemo: "websiteTemplate",
  friendlyName: "Website Template",
  packageName: process.env.PACKAGE_NAME ?? "twilio-playground-root",
  syncStorageApi: process.env.REACT_APP_SYNCSTORAGEAPI,
  userApi: process.env.REACT_APP_USERAPI,
  talonsApi: process.env.REACT_APP_FUNCTION_BASE,
  oktaDomain: process.env.REACT_APP_OKTADOMAIN,
  oktaClientId: process.env.REACT_APP_OKTACLIENTID,
  gaToken: process.env.REACT_APP_GA,
  segmentToken: process.env.REACT_APP_SEGMENT_KEY,
  rollbarToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  rollbarEnvironment: process.env.REACT_APP_ROLLBAR_ENV,
  themes: [
    {
      label: "None",
      value: "none",
    },
    {
      label: "White and Blue",
      value: "whiteAndBlue",
    },
    {
      label: "White and Red",
      value: "whiteAndRed",
    },
    {
      label: "Watermelon",
      value: "watermelon",
    },
    {
      label: "Neon",
      value: "neon",
    },
  ],
  languages: [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
  ],
};

export const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.REACT_APP_ROLLBAR_ENV,
  verbose: true,
  logLevel: process.env.REACT_APP_ROLLBAR_LOGLEVEL,
};
