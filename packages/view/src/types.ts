import { QueryType, BranchType } from "core";

export interface BranchSelectorPropsType {
  query: QueryType;
  headline: string;
  followBranch: (branch: BranchType) => void;
}

export interface TextQueryType {
  query: QueryType;
}

export type FilterCallbackType = (
  field: string,
  value: any,
  valueRange: string
) => void;
