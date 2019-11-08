import React, { useEffect } from "react";
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
import { Column, Row, Box } from "./components/elements/Layout";
import Button from "./components/elements/Button";

/**
 * STYLED COMPONENTS
 */
const MainWrap = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: row
  overflow: scroll;
  max-width: 800px;
`;

const HistoryRow = styled(Row)`
  max-height: ${props => props.theme.box.historyHeight};
`;

const StateButton = styled(Button)`
  background-color: ${(props: ButtonPropsType) =>
    props.isActive ? "white" : "lightGray"};
  border-radius: ${props => props.theme.roundRadius};
  height: 30px;
  margin: 30px;
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
  const [operation, setOperation] = useState<OperationsType>();

  /**
   * If the last operation was a filter or aggregation, show the
   * query. If not, hide it
   */
  useEffect(() => {
    if (
      (query.path &&
        query.path.length > 0 &&
        query.path[query.path.length - 1].type === "filter") ||
      query.aggregation
    ) {
      setOperation(OperationsType.Show);
    } else {
      setOperation(undefined);
    }
  }, [query]);

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
        setOperation(OperationsType.Filter);
        break;
      }
      case OperationsType.Aggregate: {
        setOperation(OperationsType.Aggregate);
        break;
      }
      case OperationsType.Show: {
        setOperation(OperationsType.Show);
        break;
      }
      default: {
        throw new Error(
          "Unkown operation. Expected 'filter', 'aggregate' or 'show query'. Got: " +
            value
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
      console.log("Query aggregated");
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
        <Row>
          {query.path &&
            query.path
              .filter((step, index) => {
                return step && index < query.path.length - 1;
              })
              .map((step, index) => {
                return (
                  <HistoryRow key={"History" + step.value}>
                    <Box>
                      <HistoryView
                        historyStep={step}
                        index={index}
                        handleStepBack={userWantsToStepBack}
                      />
                    </Box>
                  </HistoryRow>
                );
              })}
        </Row>
      </ThemeProvider>
      <ThemeProvider theme={theme}>
        <Column>
          <Box>
            <Row>
              {query.path && (
                <HistoryView
                  historyStep={query.path[query.path.length - 1]}
                  index={query.path.length - 1}
                  handleStepBack={userWantsToStepBack}
                  button
                />
              )}
            </Row>
            <Row>
              <div>
                <StateButton
                  text="Filter"
                  onClick={handleFilterAggregateClick}
                  isActive={operation === OperationsType.Filter}
                />
                <StateButton
                  text="Aggregate"
                  onClick={handleFilterAggregateClick}
                  isActive={operation === OperationsType.Aggregate}
                />
                <StateButton
                  text="Show Query"
                  onClick={handleFilterAggregateClick}
                  isActive={operation === OperationsType.Show}
                />
                <StateButton
                  text="To Table"
                  onClick={handleFilterAggregateClick}
                  isActive={operation === OperationsType.Table}
                />
              </div>
            </Row>
          </Box>
          <Row>
            {operation === OperationsType.Filter ? (
              <FilterView
                properties={query.properties || []}
                callback={userWantsToFilterQuery}
              />
            ) : operation === OperationsType.Aggregate ? (
              <AggregationView
                query={query}
                callback={userWantsToAggregateQuery}
              />
            ) : operation === OperationsType.Show ? (
              <TextQuery query={query} editFunction={() => {}} />
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
        </Column>
      </ThemeProvider>
    </MainWrap>
  );
};

export default CoordinatorView;

export * from "./types";
