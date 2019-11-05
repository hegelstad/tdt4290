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
  LabelCountType,
  ValueRangeType,
  TableType
} from "./types";

export const initialize = async (config: ConfigType): Promise<QueryType> => {
  if (config.org == undefined) {
    // Used in testing
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
  }
  const response: { result: LabelCountType[] } = await callAPI(config, {
    // Let the server do the sorting
    query:
      "g.V().groupCount().by(label).unfold().order().by(values, decr).project('name','count').by(keys).by(values)"
  });

  return {
    path: [],
    branches: response.result.map(label => ({
      type: "label",
      value: label.name
    })),
    properties: [], // Shoud we include all properties from the start?
    aggregation: undefined,
    config
  };
};

export const stringifyPath = (
  path: BranchType[],
  aggregation?: AggregationType,
  table?: TableType
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
        if (step.valueRange === "normal") {
          return `.has('${step.property}', '${step.value[0]}')`;
        } else if (step.valueRange === "not") {
          return `.not(has('${step.property}', '${step.value[0]}'))`;
        } else if (
          step.valueRange === "within" ||
          step.valueRange === "without"
        ) {
          let filterPart = `.has('${step.property}', ${step.valueRange}(`;
          for (i = 0; i < step.value.length; i++) {
            filterPart += `'${step.value[i].toString()}', `;
          }
          filterPart = filterPart.substring(0, filterPart.length - 2) + `))`;
          return filterPart;
        } else if (
          step.valueRange === "inside" ||
          step.valueRange === "outside"
        ) {
          return `.has('${step.property}', ${step.valueRange}(${step.value[0]}, ${step.value[1]}))`;
        } else if (step.valueRange === "lt" || step.valueRange === "gt") {
          return `.where(values('${step.property}').is(${step.valueRange}(${step.value[0]})))`;
        }
      }

      return "";
    })
    .reduce((a, b) => a + b, "");
  const aggregationQuery = aggregation
    ? `.properties(${aggregation.properties
        .map(prop => `"${prop}"`)
        .join(",")}).group().by(key).by(value().${aggregation.method}())`
    : "";

  const tableQuery = table
    ? table.hasColumnNames
      ? `.project(${table.columnNames.map(prop => `"${prop}"`).join(",")})
      ${table.value.map(prop => `.by("${prop}")`).join("")}`
      : table.tableType === "single"
      ? `.values("${table.value[0]}")`
      : `.valueMap(${table.value.map(prop => `"${prop}"`).join(",")})`
    : "";
  console.log("stringifyPath -> table: " + table);
  console.log("stringifyPath -> tableQuery: " + tableQuery);

  return baseQuery + pathQuery + aggregationQuery + tableQuery;
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
    query: stringifyPath(query.path, query.aggregation, query.table)
  })).result;
};

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
  value: any,
  valueRange: ValueRangeType
): Promise<QueryType> => {
  const filter: FilterType = { type: "filter", property, value, valueRange };
  const path = [...query.path, filter];
  return {
    ...query,
    path,
    branches: await getBranches(query.config, path),
    properties: await getProperties(query.config, path)
  };
};

export const createTableQuery = async (
  query: QueryType,
  tableType: string,
  hasColumnNames: boolean,
  value: string[],
  columnNames: string[]
): Promise<QueryType> => {
  return {
    ...query,
    table: {
      tableType,
      hasColumnNames,
      value,
      columnNames
    }
  };
};

/**
 * Gets suggestions from the given source, or shows the top results
 * based on some criteria
 */
export const getSuggestions = (
  value: string,
  source: BranchType[]
): BranchType[] => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? source.slice(0, 6)
    : source.filter(label => {
        return label.value
          .trim()
          .toLowerCase()
          .includes(inputValue);
      });
};

export * from "./types";
