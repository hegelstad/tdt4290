import { QueryType, BranchType, TableType } from "core";

export interface BranchSelectorPropsType {
  query: QueryType;
  headline: string;
  followBranch: (branch: BranchType) => void;
}

export interface TextQueryType {
  query: QueryType;
  editFunction: Function; //This function should take the query as a string as argument and send it to a component suitable for editing the query.
}

export type FilterCallbackType = (
  field: string,
  value: any,
  valueRange: string
) => void;

export type TableCallbackType = (
  tableType: string,
  hasColumnNames: boolean,
  properties: string[],
  columnNames: string[]
) => void;
