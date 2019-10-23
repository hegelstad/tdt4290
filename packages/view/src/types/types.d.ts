export interface BranchSelectorPropsType {
  query: QueryType;
  headline: string;
  followBranch: (branch: BranchType) => void;
}

export interface TextQueryType {
  query: QueryType;
}

export interface FilterQueryPropsType {
  field: string;
  value: string;
}
