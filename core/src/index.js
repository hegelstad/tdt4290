import { callAPI } from "./utils";

export const initialize = async config => {
  const response = await callAPI(config, {
    query: "g.V().label().dedup()"
  });

  return {
    path: [],
    branches: response.result.map(label => ({ type: "label", value: label })),
    config
  };
};

const stringifyPath = path => {
  const baseQuery = "g.V()";
  const pathQuery = path
    .map(step => {
      if (step.type === "label") {
        return `.hasLabel('${step.value}')`;
      }
      if (step.type === "edge") {
        return `.in('${step.value}')`;
      }
    })
    .reduce((a, b) => a + b, "");
  return baseQuery + pathQuery;
};

export const followBranch = async (query, target) => {
  return {
    ...query,
    path: [...query.path, target],
    branches: await getBranches(query, target)
  };
};

export const getBranches = async (query, target) => {
  const baseQueryString = stringifyPath([...query.path, target]);
  const labelQueryString = `${baseQueryString}.both().label().dedup()`;
  const edgeQueryString = `${baseQueryString}.bothE().label().dedup()`;

  const response = await Promise.all([
    callAPI(query.config, {
      query: labelQueryString
    }),
    callAPI(query.config, {
      query: edgeQueryString
    })
  ]);
  const labels = response[0].result.map(label => ({
    type: "label",
    value: label
  }));
  const edges = response[1].result.map(label => ({
    type: "edge",
    value: label
  }));
  return [...labels, ...edges];
};
