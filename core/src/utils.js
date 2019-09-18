export const callAPI = async (config, body) => {
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
