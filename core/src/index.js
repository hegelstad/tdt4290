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
        return `.${step.direction}('${step.value}')`;
      }
      if (step.type === "filter") {
        return `.has('${step.property}', '${step.value}')`;
      }
    })
    .reduce((a, b) => a + b, "");
  return baseQuery + pathQuery;
};

export const followBranch = async (query, target) => {
  const path = [...query.path, target];
  return {
    ...query,
    path,
    branches: await getBranches(query.config, path),
    properties: await getProperties(query.config, path)
  };
};

export const filterQuery = async (query, property, value) => {
  const filter = { type: "filter", property, value };
  const path = [...query.path, filter];
  return {
    ...query,
    path,
    branches: await getBranches(query.config, path),
    properties: await getProperties(query.config, path)
  };
};

export const executeQuery = async query => {
  return (await callAPI(query.config, {
    query: stringifyPath(query.path)
  })).result;
};

const getBranches = async (config, path) => {
  const baseQueryString = stringifyPath(path);
  const labelQueryString = `${baseQueryString}.both().label().dedup()`;
  const edgeInQueryString = `${baseQueryString}.inE().label().dedup()`;
  const edgeOutQueryString = `${baseQueryString}.outE().label().dedup()`;

  // Could look into combining these into one query to reduce network requests
  // Not a huge performance issue now as they run in parallel
  const response = await Promise.all([
    callAPI(config, {
      query: labelQueryString
    }),
    callAPI(config, {
      query: edgeInQueryString
    }),
    callAPI(config, {
      query: edgeOutQueryString
    })
  ]);
  const labels = response[0].result.map(label => ({
    type: "label",
    value: label
  }));
  const edgesIn = response[1].result.map(edge => ({
    type: "edge",
    value: edge,
    direction: "in"
  }));
  const edgesOut = response[2].result.map(edge => ({
    type: "edge",
    value: edge,
    direction: "out"
  }));
  return [...labels, ...edgesIn, ...edgesOut];
};

const getProperties = async (config, path) => {
  const baseQueryString = stringifyPath(path);
  const propertiesQueryString = `${baseQueryString}.properties().label().dedup()`;
  return (await callAPI(config, {
    query: propertiesQueryString
  })).result;
};
