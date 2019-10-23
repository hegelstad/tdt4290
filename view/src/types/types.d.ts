import { PropertyType } from "core/dist/types";

export interface BranchSelectorPropsType {
  query: QueryType;
  headline: string;
  followBranch: (branch: BranchType) => void;
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
