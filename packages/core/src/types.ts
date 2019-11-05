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
  table?: TableType;
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
  property: string;
  value: any;
  valueRange: string;
}

export interface TableType {
  tableType: string;
  hasColumnNames: boolean;
  value: string[];
  columnNames: string[];
}

export interface AggregationType {
  properties: PropertyType[];
  method: MethodTypes;
}

export type PropertyType = string;
export type ValueRangeType = string;

export type BranchType = LabelType | EdgeType | FilterType;

export enum MethodTypes {
  Sum = "sum",
  Mean = "mean"
}
