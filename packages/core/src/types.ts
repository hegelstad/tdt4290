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
  notValue: boolean;
}

export interface LabelCountType {
  name: string;
  count: number;
}

export interface EdgeType {
  type: "edge";
  value: string;
  direction: "in" | "out";
  notValue: boolean;
}

export interface FilterType {
  type: "filter";
  // eslint-disable-next-line
  value: any;
  notValue?: boolean;
  property: PropertyType;
  valueRange: ValueRangeTypes;
}

export interface TableType {
  tableType: string;
  hasColumnNames: boolean;
  properties: PropertyType[];
  columnNames: string[];
  notValue?: boolean;
}

export interface AggregationType {
  properties: PropertyType[];
  method: MethodTypes;
  notValue?: boolean;
}

export interface PropertyType {
  label: string;
  type: PropertyTypes;
}

export interface PropertyRawType {
  label: string;
  value: string;
}

export type BranchType = LabelType | EdgeType | FilterType;

export enum PropertyTypes {
  String,
  StringArray,
  Number,
  Boolean,
  Undefined
}

export enum MethodTypes {
  Sum = "sum",
  Mean = "mean",
  Count = "count"
}

export enum ValueRangeTypes {
  Gt = "gt",
  Inside = "inside",
  Lt = "lt",
  Normal = "normal",
  Not = "not",
  Outside = "outside",
  Within = "within",
  Without = "without",
  Undefined = "undefined"
}
