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

export interface TextQueryType {
  query: QueryType;
}
export type FilterCallbackType = (field: PropertyType, value: string) => void;
