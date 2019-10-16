import React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { followBranch } from "core";
import { BranchType, QueryType } from "core/dist/types";
import BranchSelector from "./components/BranchSelector";
import AggregationView from "./components/AggregationView";
import TextQuery from "./components/TextQuery";
import theme from "./styles/theme";
import styled from "styled-components";
import { BranchSelectorPropsType } from "./types/types";

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

      <ThemeProvider theme={theme}>
        <TextQuery query={query} />
      </ThemeProvider>
    </MainWrap>
  );
};

export default CoordinatorView;
