import {
  QueryType,
  BranchType,
  PropertyType,
  AggregationType,
  ValueRangeTypes
} from "core";

export interface BranchSelectorPropsType {
  query: QueryType;
  headline: string;
  followBranch: (branch: BranchType) => void;
}

export interface AggregationViewPropsType {
  query: QueryType;
  callback: (aggregation: AggregationType) => void;
}

export interface ButtonPropsType {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  floatRight?: boolean;
}

export interface TextQueryType {
  query: QueryType;
  editFunction: Function; //This function should take the query as a string as argument and send it to a component suitable for editing the query.
}

export type FilterCallbackType = (
  field: PropertyType,
  value: any[],
  valueRange: ValueRangeTypes
) => void;

export type TableCallbackType = (
  tableType: string,
  hasColumnNames: boolean,
  properties: PropertyType[],
  columnNames: string[]
) => void;
