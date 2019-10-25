import React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { followBranch, filterQuery } from "core";
import { BranchType, QueryType } from "core/dist/types";
import BranchSelector from "./components/BranchSelector";
import AggregationView from "./components/AggregationView";
import TextQuery from "./components/TextQuery";
import theme from "./styles/theme";
import styled from "styled-components";
import { BranchSelectorPropsType, FilterCallbackType } from "./types";
import FilterView from "./components/FilterView";

const CoordinatorView = (props: BranchSelectorPropsType): JSX.Element => {
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
    max-width: 600px;
    margin: 0 auto;
    padding-left: 10px;
    border: 1px solid black;
    display: flex;
  `;

  const Column = styled.div`
    flex: 50%;
    padding: 10px;
  `;
  const userWantsToFilterQuery: FilterCallbackType = (field, value) => {
    filterQuery(query, field, value).then(newQuery => {
      setQuery(newQuery);
    });
  };

  return (
    <MainWrap>
      <ThemeProvider theme={theme}>
        <Column>
          <BranchSelector
            query={query}
            headline={branchSelectorHeadline}
            followBranch={userWantsToFollowBranch}
          />
        </Column>
      </ThemeProvider>
      <FilterView
        properties={query.properties || []}
        callback={userWantsToFilterQuery}
      />

      <ThemeProvider theme={theme}>
        <Column>
          <AggregationView query={query} />
          <TextQuery query={query} />
        </Column>
      </ThemeProvider>
    </MainWrap>
  );
};

export default CoordinatorView;

export * from "./types";
