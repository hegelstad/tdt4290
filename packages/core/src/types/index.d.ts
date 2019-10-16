interface ConfigType {
  apiURL: string;
  org: string;
  token: string;
}
interface QueryType {
  path: BranchType[];
  branches: BranchType[];
  config: ConfigType;
  properties: PropertyType[];
  aggregation?: AggregationType;
}
interface LabelType {
  type: "label";
  value: string;
}

interface SortableLabelType {
  name: string;
  count: number;
}
interface EdgeType {
  type: "edge";
  value: string;
  direction: "in" | "out";
}
interface FilterType {
  type: "filter";
  value: any;
  property: string;
}
interface AggregationType {
  properties: PropertyType[];
  method: MethodTypes;
}

type PropertyType = string;
type BranchType = LabelType | EdgeType | FilterType;
enum MethodTypes {
  sum = "sum",
  mean = "mean"
}
