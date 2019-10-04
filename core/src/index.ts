import { callAPI } from "./utils";
import {
  ConfigType,
  BranchType,
  AggregationType,
  QueryType,
  FilterType,
  PropertyType,
  MethodTypes,
  LabelType,
  EdgeType,
  SortableLabelType
} from "./types";

export const initialize = async (config: ConfigType): Promise<QueryType> => {
  const response: { result: string[] } = await callAPI(config, {
    query: "g.V().label().dedup()"
  });
  return {
    path: [],
    branches: response.result.map(label => ({ type: "label", value: label })),
    properties: [], // Shoud we include all properties from the start?
    aggregation: undefined,
    config
  };
};

const stringifyPath = (
  path: BranchType[],
  aggregation?: AggregationType
): string => {
  const baseQuery = "g.V()";
  const pathQuery = path
    .map((step, i): string => {
      if (step.type === "label") {
        return i === 0
          ? `.hasLabel('${step.value}')`
          : `.both().hasLabel('${step.value}')`;
      }
      if (step.type === "edge") {
        return `.${step.direction}('${step.value}')`;
      }
      if (step.type === "filter") {
        return `.has('${step.property}', '${step.value}')`;
      }
      return "";
    })
    .reduce((a, b) => a + b, "");
  const aggregationQuery = aggregation
    ? `.properties(${aggregation.properties
        .map(prop => `"${prop}"`)
        .join(",")}).group().by(key).by(value().${aggregation.method}())`
    : "";
  return baseQuery + pathQuery + aggregationQuery;
};

export const followBranch = async (
  query: QueryType,
  target: BranchType
): Promise<QueryType> => {
  const path = [...query.path, target];
  return {
    ...query,
    path,
    branches: await getBranches(query.config, path),
    properties: await getProperties(query.config, path)
  };
};

export const filterQuery = async (
  query: QueryType,
  property: PropertyType,
  value: any
): Promise<QueryType> => {
  const filter: FilterType = { type: "filter", property, value };
  const path = [...query.path, filter];
  return {
    ...query,
    path,
    branches: await getBranches(query.config, path),
    properties: await getProperties(query.config, path)
  };
};

export const aggregateQuery = async (
  query: QueryType,
  properties: PropertyType[],
  method: MethodTypes
): Promise<QueryType> => {
  return {
    ...query,
    aggregation: {
      properties,
      method
    }
  };
};

export const executeQuery = async (query: QueryType): Promise<object> => {
  return (await callAPI(query.config, {
    query: stringifyPath(query.path, query.aggregation)
  })).result;
};

export const getAllLabels = async (
    config: ConfigType
  ): Promise<SortableLabelType[]> => {

    const response = await callAPI(config, {
      query: "g.V().groupCount().by(label).unfold().order().by(values, decr).project('name','count').by(keys).by(values)"
    })
    
    return response.result
}

const getBranches = async (
  config: ConfigType,
  path: BranchType[]
): Promise<BranchType[]> => {
  const baseQueryString = stringifyPath(path);
  const labelQueryString = `${baseQueryString}.both().label().dedup()`;
  const edgeInQueryString = `${baseQueryString}.inE().label().dedup()`;
  const edgeOutQueryString = `${baseQueryString}.outE().label().dedup()`;

  // Could look into combining these into one query to reduce network requests
  // Not a huge performance issue now as they run in parallel
  const response: ({ result: string[] })[] = await Promise.all([
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
  const labels: LabelType[] = response[0].result.map(label => ({
    type: "label",
    value: label
  }));
  const edgesIn: EdgeType[] = response[1].result.map(edge => ({
    type: "edge",
    value: edge,
    direction: "in"
  }));
  const edgesOut: EdgeType[] = response[2].result.map(edge => ({
    type: "edge",
    value: edge,
    direction: "out"
  }));
  return [...labels, ...edgesIn, ...edgesOut];
};

const getProperties = async (
  config: ConfigType,
  path: BranchType[]
): Promise<PropertyType[]> => {
  const baseQueryString = stringifyPath(path);
  const propertiesQueryString = `${baseQueryString}.properties().label().dedup()`;
  return (await callAPI(config, {
    query: propertiesQueryString
  })).result;
};
