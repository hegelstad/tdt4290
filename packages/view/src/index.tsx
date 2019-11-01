import React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import {
  followBranch,
  filterQuery,
  popPath,
  QueryType,
  BranchType
} from "core";
import BranchSelector from "./components/BranchSelector";
import HistoryView from "./components/HistoryView";
import TextQuery from "./components/TextQuery";
import theme from "./styles/theme";
import { BranchSelectorPropsType, FilterCallbackType } from "./types";
import FilterView from "./components/FilterView";

const CoordinatorView = (props: BranchSelectorPropsType) => {
  const [query, setQuery] = useState<QueryType>(props.query);
  const branchSelectorHeadline =
    query.path && query.path.length > 0
      ? (query.path[query.path.length - 1].value as string)
      : "Where would you like to start?";

  console.log("Query on enter of CoordinatorView:", query);
  if (!query.branches && props.query.branches) {
    setQuery(props.query);
  }

  const userWantsToFollowBranch = (branch: BranchType): void => {
    followBranch(query, branch).then(newQuery => {
      setQuery(newQuery);
    });
  };

  const userWantsToFilterQuery: FilterCallbackType = (field, value) => {
    filterQuery(query, field, value).then(newQuery => {
      setQuery(newQuery);
    });
  };

  const userWantsToStepBack = async () => {
    const newQuery = await popPath(query);
    setQuery(newQuery);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <HistoryView
            history={query.path}
            handleStepBack={userWantsToStepBack}
          />
        </div>
        <div>
          <BranchSelector
            query={query}
            headline={branchSelectorHeadline}
            followBranch={userWantsToFollowBranch}
          />
          <FilterView
            properties={query.properties || []}
            callback={userWantsToFilterQuery}
          />
          <TextQuery query={query} editFunction={() => {}} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CoordinatorView;

export * from "./types";
