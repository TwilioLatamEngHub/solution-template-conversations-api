const baseUrl = process.env.REACT_APP_FUNCTION_BASE;
const _createFetchOptions = (body: {}) => {
  return {
    method: "POST",
    body: new URLSearchParams(body),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  };
};

const sendEmail = async (
  Token: unknown,
  to: unknown,
  subject: unknown,
  body: unknown
) => {
  const fetchBody = {
    Token,
    html: body,
    subject,
    toAddress: to,
  };

  const options = _createFetchOptions(fetchBody);

  try {
    let response = await fetch(baseUrl + "/sendEmail?mode=HTML", options);
    let result = await response.json();
    console.log("sent email", result);
    trackAction("email");
    return result;
  } catch (err) {
    console.error(err);
    trackAction("emailError");
    return false;
  }
};

const trackAction = (
  action: string,
  traits?: unknown,
  externalIds?: unknown
) => {
  if (!process.env.REACT_APP_SEGMENT_KEY) return;
  // @ts-ignore
  if (!window.analytics) return;

  // @ts-ignore
  window.analytics.track(
    action,
    {
      traits,
    },
    { externalIds }
  );
};

const identify = (userId: unknown, traits: unknown) => {
  if (!process.env.REACT_APP_SEGMENT_KEY) return;
  // @ts-ignore
  if (!window.analytics) return;
  // @ts-ignore
  window.analytics.identify(`${userId}`, traits);
};

export { sendEmail, trackAction, identify };
