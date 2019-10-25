import { ConfigType } from "./types";

export const callAPI = async (
  config: ConfigType,
  body: object
  // eslint-disable-next-line
): Promise<any> => {
  const response = await fetch(`${config.apiURL}?org=${config.org}`, {
    method: "POST",
    headers: {
      Authorization: `Token token=${config.token}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });
  return await response.json();
};
