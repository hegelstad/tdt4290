export interface BranchSelectorPropsType {

    query: QueryType;
    headline: string;
    followBranch: (branch: BranchType) => void;
}

export interface TextQueryType {
    query: QueryType;
}

