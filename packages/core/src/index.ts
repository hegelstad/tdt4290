import { callAPI } from "./utils";
import {
  ConfigType,
  BranchType,
  AggregationType,
  QueryType,
  FilterType,
  PropertyType,
  PropertyTypes,
  LabelType,
  EdgeType,
  LabelCountType,
  PropertyRawType,
  MethodTypes,
  ValueRangeTypes
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
        const typeIsString = () => {
          if (
            step.property.type === PropertyTypes.String ||
            step.property.type === PropertyTypes.StringArray
          ) {
            return true;
          }
          return false;
        };
        if (step.valueRange === ValueRangeTypes.Normal) {
          return (
            `.has('${step.property.label}', ` +
            (typeIsString() ? `'${step.value[0]}'` : `${step.value[0]}`) +
            `)`
          );
        } else if (step.valueRange === ValueRangeTypes.Not) {
          return (
            `.not(has('${step.property.label}', ` +
            (typeIsString() ? `'${step.value[0]}'` : `${step.value[0]}`) +
            `))`
          );
        } else if (
          step.valueRange === ValueRangeTypes.Within ||
          step.valueRange === ValueRangeTypes.Without
        ) {
          let filterPart = `.has('${step.property.label}', ${step.valueRange}(`;
          for (i = 0; i < step.value.length; i++) {
            filterPart += `'${step.value[i].toString()}', `;
          }
          filterPart = filterPart.substring(0, filterPart.length - 2) + `))`;
          return filterPart;
        } else if (
          step.valueRange === ValueRangeTypes.Inside ||
          step.valueRange === ValueRangeTypes.Outside
        ) {
          return `.has('${step.property.label}', ${step.valueRange}(${step.value[0]}, ${step.value[1]}))`;
        } else if (
          step.valueRange === ValueRangeTypes.Lt ||
          step.valueRange === ValueRangeTypes.Gt
        ) {
          return `.where(values('${step.property.label}').is(${step.valueRange}(${step.value[0]})))`;
        }
      }
      return "";
    })
    .reduce((a, b) => a + b, "");
  const aggregationQuery = aggregation
    ? aggregation.method === MethodTypes.Count
      ? ".count()"
      : `.properties(${aggregation.properties
          .map(prop => `"${prop.label}"`)
          .join(",")}).group().by(key).by(value().${aggregation.method}())`
    : "";
  return baseQuery + pathQuery + aggregationQuery;
};

export const aggregateQuery = async (
  query: QueryType,
  aggregation: AggregationType
): Promise<QueryType> => {
  return {
    ...query,
    aggregation: aggregation
  };
};

export const executeQuery = async (query: QueryType): Promise<object> => {
  return (await callAPI(query.config, {
    query: stringifyPath(query.path, query.aggregation)
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
  const propertiesQueryString = `${baseQueryString}.properties().dedup().by(label()).project("label", "value").by(label()).by(value())`;
  const tempResult: [PropertyRawType] = (await callAPI(config, {
    query: propertiesQueryString
  })).result;
  return tempResult.map(property => {
    const newProperty = {
      label: property.label as string,
      type: PropertyTypes.Undefined
    };
    if (property.value) {
      // Logic to figure out what type the property is. This information is used in aggregation and filtering
      // eslint-disable-next-line no-var
      let isNumber = !isNaN(Number(property.value));
      try {
        /**
        Number-type does not have the includes()-method, i.e. if property.value is a number
        the codeline below will crash, and then we know it is a number
        */
        property.value.includes("");
        isNumber = false;
      } catch {
        isNumber = true;
      }
      const isBoolean = property.value === "true" || property.value === "false";
      const isStringArray = property.value.length; // If the length of the value isn't undefined, it is an Array..?
      const isString = String(property.value);
      if (isNumber) {
        newProperty.type = PropertyTypes.Number;
      } else if (isBoolean) {
        newProperty.type = PropertyTypes.Boolean;
      } else if (isStringArray) {
        newProperty.type = PropertyTypes.StringArray;
      } else if (isString) {
        newProperty.type = PropertyTypes.String;
      }
    }
    return newProperty;
  });
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
  valueRange: ValueRangeTypes
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

export const popPath = async (query: QueryType): Promise<QueryType> => {
  if (query.path.length === 0) {
    return query;
  }
  const path = query.path.slice(0, -1);
  return {
    ...query,
    path,
    aggregation: undefined,
    branches: await getBranches(query.config, path),
    properties: await getProperties(query.config, path)
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
