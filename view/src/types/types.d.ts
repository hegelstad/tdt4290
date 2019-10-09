export interface BranchSelectorPropsType {
    initialQuery: QueryType;
    headline: string;
    followBranch: (branch: BranchType) => void;
}