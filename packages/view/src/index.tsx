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
import {
  BranchSelectorPropsType,
  FilterCallbackType,
  OperationsType,
  ButtonPropsType
} from "./types";
import { Column, Row } from "./components/elements/Layout";
import Button from "./components/elements/Button";

/**
 * STYLED COMPONENTS
 */
const MainWrap = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding-left: 10px;
  display: flex;
`;

const StateButton = styled(Button)`
  background-color: ${(props: ButtonPropsType) =>
    props.isActive ? "grayLight" : "white"};
  margin: 0 19% 8px 17%;
`;

const StartupWrap = styled.div`
        max-width: 300px;
        margin: 0 auto;
        
        display: flex
        flex-direction: column;
    `;

/**
 * Define a separate view for the intitial StartupView, since it has
 * less elements on the screen at a time
 */
const StartUpView = ({
  query,
  headline,
  followBranch
}: {
  query: QueryType;
  headline: string;
  followBranch: (branch: BranchType) => void;
}) => {
  return (
    <StartupWrap>
      <ThemeProvider theme={theme}>
        <BranchSelector
          query={query}
          headline={headline}
          followBranch={followBranch}
        />
      </ThemeProvider>
    </StartupWrap>
  );
};

const CoordinatorView = (props: BranchSelectorPropsType): JSX.Element => {
  const [query, setQuery] = useState<QueryType>(props.query);
  const [filterOrAggregate, setFilterOrAggregate] = useState<OperationsType>();

  const branchSelectorHeadline =
    query.path && query.path.length > 0
      ? "Next step"
      : "Where would you like to start?";

  const handleFilterAggregateClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const value = (event.currentTarget.textContent as string).toLowerCase();
    switch (value) {
      case OperationsType.Filter: {
        setFilterOrAggregate(OperationsType.Filter);
        break;
      }
      case OperationsType.Aggregate: {
        setFilterOrAggregate(OperationsType.Aggregate);
        break;
      }
      default: {
        throw new Error(
          "Unkown operation. Expected 'filter' or 'aggregate'. Got: " + value
        );
      }
    }
  };

  const userWantsToFollowBranch = (branch: BranchType): void => {
    followBranch(query, branch).then((newQuery: QueryType) => {
      setQuery(newQuery);
    });
  };

  const userWantsToFilterQuery: FilterCallbackType = (field, value) => {
    filterQuery(query, field, value).then(newQuery => {
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

  return query.path && query.path.length == 0 ? (
    <StartUpView
      query={query}
      headline={branchSelectorHeadline}
      followBranch={userWantsToFollowBranch}
    />
  ) : (
    <MainWrap>
      <ThemeProvider theme={theme}>
        <Column>
          <Row>
            <HistoryView
              history={query.path}
              handleStepBack={userWantsToStepBack}
            />
          </Row>
          <Row>
            <div>
              <StateButton
                text="Filter"
                onClick={handleFilterAggregateClick}
                isActive={filterOrAggregate === OperationsType.Filter}
              />
              <StateButton
                text="Aggregate"
                onClick={handleFilterAggregateClick}
                isActive={filterOrAggregate === OperationsType.Aggregate}
              />
            </div>
          </Row>
          <Row>
            {filterOrAggregate === OperationsType.Filter ? (
              <FilterView
                properties={query.properties || []}
                callback={userWantsToFilterQuery}
              />
            ) : filterOrAggregate === OperationsType.Aggregate ? (
              <AggregationView
                query={query}
                callback={userWantsToAggregateQuery}
              />
            ) : (
              <div />
            )}
          </Row>
        </Column>
      </ThemeProvider>
      <ThemeProvider theme={theme}>
        <Column>
          <BranchSelector
            query={query}
            headline={branchSelectorHeadline}
            followBranch={userWantsToFollowBranch}
          />
          <TextQuery query={query} editFunction={() => {}} />
        </Column>
      </ThemeProvider>
    </MainWrap>
  );
};

export default CoordinatorView;

export * from "./types";
