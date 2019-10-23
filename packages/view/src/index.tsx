import React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { filterQuery, followBranch } from "core";
import { BranchType, QueryType } from "core/dist/types";
import BranchSelector from "./components/BranchSelector";
import TextQuery from "./components/TextQuery";
import theme from "./styles/theme";
import styled from "styled-components";
import { BranchSelectorPropsType, FilterCallbackType } from "./types/types";
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

  const userWantsToFollowBranch = (branch: BranchType) => {
    followBranch(query, branch).then(newQuery => {
      setQuery(newQuery);
    });
  };

  const userWantsToFilterQuery: FilterCallbackType = (field, value) => {
    filterQuery(query, field, value).then(newQuery => {
      setQuery(newQuery);
    });
  };
  /**
   * STYLED COMPONENTS
   */
  const MainWrap = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding-left: 10px;
    border: 1px solid black;
    display: block;
  `;
  return (
    <MainWrap>
      <ThemeProvider theme={theme}>
        <BranchSelector
          query={query}
          headline={branchSelectorHeadline}
          followBranch={userWantsToFollowBranch}
        />
      </ThemeProvider>
      <FilterView
        properties={query.properties || []}
        callback={userWantsToFilterQuery}
      />

      <ThemeProvider theme={theme}>
        <TextQuery query={query} />
      </ThemeProvider>
    </MainWrap>
  );
};

export default CoordinatorView;
