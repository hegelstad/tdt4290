import "isomorphic-fetch";
import { ConfigType } from "./types";
import { callAPI } from "./utils";

const config: ConfigType = {
  org: process.env.ORG || "",
  token: process.env.TOKEN || "",
  apiURL: "https://app.ardoq.com/api/graph-search"
};

test("The test config works", async () => {
  const response = await callAPI(config, {
    query: "g.V().limit(10)"
  });
  expect(response.result.length).toBe(10);
});
