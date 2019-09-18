import { callAPI } from "./utils";

export const initialize = async config => {
  const response = await callAPI(config, {
    query: "g.V().label().dedup()"
  });

  return {
    path: [],
    branches: response.result.map(label => ({ type: "label", value: label })),
    properties: [], // Shoud we include all properties from the start?
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
      if (step.type === "filter") {
        return `.has('${step.property}', '${step.value}')`;
      }
    })
    .reduce((a, b) => a + b, "");
  return baseQuery + pathQuery;
};

export const followBranch = async (query, target) => {
  return {
    ...query,
    path: [...query.path, target],
    branches: await getBranches(query, target),
    properties: await getProperties(query, target)
  };
};

export const filterQuery = async (query, property, value) => {
  const filter = { type: "filter", property, value };
  return {
    ...query,
    path: [...query.path, filter],
    branches: await getBranches(query, filter),
    properties: await getProperties(query, filter)
  };
};

export const executeQuery = async query => {
  return (await callAPI(query.config, {
    query: stringifyPath(query.path)
  })).result;
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
  const edges = response[1].result.map(edge => ({
    type: "edge",
    value: edge
  }));
  return [...labels, ...edges];
};

export const getProperties = async (query, target) => {
  const baseQueryString = stringifyPath([...query.path, target]);
  const propertiesQueryString = `${baseQueryString}.properties().label().dedup()`;
  return (await callAPI(query.config, {
    query: propertiesQueryString
  })).result;
};
