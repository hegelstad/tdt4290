import { QueryType, BranchType, PropertyType, AggregationType } from "core";

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
  isActive?: boolean;
}

export interface TextQueryType {
  query: QueryType;
  editFunction: Function; //This function should take the query as a string as argument and send it to a component suitable for editing the query.
}
export type FilterCallbackType = (field: PropertyType, value: string) => void;

export enum OperationsType {
  Filter = "filter",
  Aggregate = "aggregate",
  Show = "show query",
  Table = "table"
}
