import React from "react";
import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import {
  followBranch,
  filterQuery,
  aggregateQuery,
  popPath,
  AggregationType,
  QueryType,
  BranchType
} from "core";
import BranchSelector from "./components/BranchSelector";
import AggregationView from "./components/AggregationView";
import HistoryView from "./components/HistoryView";
import TextQuery from "./components/TextQuery";
import FilterView from "./components/FilterView";
import theme from "./styles/theme";
import { BranchSelectorPropsType, FilterCallbackType } from "./types";

const CoordinatorView = (props: BranchSelectorPropsType): JSX.Element => {
  const [query, setQuery] = useState<QueryType>(props.query);
  const branchSelectorHeadline =
    query.path && query.path.length > 0
      ? (query.path[query.path.length - 1].value as string)
      : "Where would you like to start?";
  const branchSelectorHeadlinePrefix =
    query.path &&
    query.path.length > 0 &&
    query.path[query.path.length - 1].notValue
      ? "Everything but "
      : "";

  if (!query.branches && props.query.branches) {
    setQuery(props.query);
  }

  const userWantsToFollowBranch = (branch: BranchType): void => {
    followBranch(query, branch).then((newQuery: QueryType) => {
      setQuery(newQuery);
    });
  };

  /**
   * STYLED COMPONENTS
   */
  const MainWrap = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding-left: 10px;
    border: 1px solid black;
    display: flex;
  `;

  const Column = styled.div`
    flex: 50%;
    padding: 10px;
  `;
  const userWantsToFilterQuery: FilterCallbackType = (
    field,
    value,
    valueRange
  ) => {
    filterQuery(query, field, value, valueRange).then(newQuery => {
      setQuery(newQuery);
    });
  };

  const userWantsToAggregateQuery = (aggregation: AggregationType): void => {
    aggregateQuery(query, aggregation).then((newQuery: QueryType) => {
      setQuery(newQuery);
    });
  };

  const userWantsToStepBack = async () => {
    const newQuery = await popPath(query);
    setQuery(newQuery);
  };

  return (
    <MainWrap>
      <ThemeProvider theme={theme}>
        <Column>
          <HistoryView
            history={query.path}
            handleStepBack={userWantsToStepBack}
          />
        </Column>
      </ThemeProvider>
      <ThemeProvider theme={theme}>
        <Column>
          <BranchSelector
            query={query}
            headline={branchSelectorHeadlinePrefix + branchSelectorHeadline}
            followBranch={userWantsToFollowBranch}
          />
          <FilterView
            properties={query.properties || []}
            callback={userWantsToFilterQuery}
          />
        </Column>
      </ThemeProvider>
      <ThemeProvider theme={theme}>
        <Column>
          <AggregationView query={query} callback={userWantsToAggregateQuery} />
          <TextQuery query={query} editFunction={() => {}} />
        </Column>
      </ThemeProvider>
    </MainWrap>
  );
};

export default CoordinatorView;

export * from "./types";
