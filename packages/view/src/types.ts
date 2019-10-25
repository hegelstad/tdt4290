import {
  QueryType,
  BranchType,
  PropertyType,
  MethodTypes,
  AggregationType
} from "core";

export interface BranchSelectorPropsType {
  query: QueryType;
  headline: string;
  followBranch: (branch: BranchType) => void;
}

export interface AggregationViewPropsType {
  query: QueryType;
}

export interface TextQueryType {
  query: QueryType;
}

export type AggregationReducerState = {
  aggregations: AggregationType[];
};

export type AggregationReducerAction = {
  property: PropertyType;
  methodType: MethodTypes;
};
export type FilterCallbackType = (field: PropertyType, value: string) => void;
