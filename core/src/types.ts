export interface ConfigType {
  apiURL: string;
  org: string;
  token: string;
}
export interface QueryType {
  path: BranchType[];
  branches: BranchType[];
  config: ConfigType;
  properties: PropertyType[];
  aggregation?: AggregationType;
}
export interface LabelType {
  type: "label";
  value: string;
}

export interface LabelCountType {
  name: string;
  count: number;
}

export interface EdgeType {
  type: "edge";
  value: string;
  direction: "in" | "out";
}
export interface FilterType {
  type: "filter";
  value: any;
  property: string;
}
export interface AggregationType {
  properties: PropertyType[];
  method: MethodTypes;
}

export type PropertyType = string;
export type BranchType = LabelType | EdgeType | FilterType;
export enum MethodTypes {
  Sum = "sum",
  Mean = "mean"
}
