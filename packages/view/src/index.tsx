import React, { useEffect } from "react";
import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import {
  followBranch,
  filterQuery,
  aggregateQuery,
  createTableQuery,
  popPath,
  AggregationType,
  QueryType,
  BranchType
} from "core";
import BranchSelector from "./components/BranchSelector";
import AggregationView from "./components/AggregationView";
import { CurrentStep, PastSteps } from "./components/HistoryView";
import TextQuery from "./components/TextQuery";
import FilterView from "./components/FilterView";
import TableView from "./components/TableView";
import theme from "./styles/theme";
import {
  BranchSelectorPropsType,
  FilterCallbackType,
  TableCallbackType,
  OperationsType,
  ButtonPropsType
} from "./types";
import { Box } from "./components/elements/Layout";
import Button from "./components/elements/Button";

/**
 * STYLED COMPONENTS
 */
const MainWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StateButton = styled(Button)`
  background-color: ${(props: ButtonPropsType) =>
    props.isActive ? "white" : "lightGray"};
  border-radius: ${props => props.theme.roundRadius};
  height: 30px;
  margin: 30px;
`;

const renderStateButtons = (
  handler: (event: React.MouseEvent<HTMLButtonElement>) => void,
  currentOperation?: OperationsType
) => {
  const buttons = [];
  for (const operation in OperationsType) {
    const text = operation.charAt(0).toUpperCase() + operation.slice(1);
    buttons.push(
      <StateButton
        key={text}
        text={text === "Show" ? "Show query" : text}
        onClick={handler}
        isActive={currentOperation === operation}
      />
    );
  }
  return buttons;
};

const renderOperationsView = (
  currentOperation: OperationsType,
  query: QueryType,
  filterCallback: FilterCallbackType,
  tableCallback: TableCallbackType,
  aggregationCallback: (aggregation: AggregationType) => void,
  editCallback?: (query: string) => void
) => {
  return (
    <div>
      {currentOperation === OperationsType.Filter ? (
        <FilterView
          properties={query.properties || []}
          callback={filterCallback}
        />
      ) : currentOperation === OperationsType.Table ? (
        <TableView
          properties={query.properties || []}
          callback={tableCallback}
        />
      ) : currentOperation === OperationsType.Aggregate ? (
        <AggregationView query={query} callback={aggregationCallback} />
      ) : currentOperation === OperationsType.Show ? (
        <TextQuery query={query} editFunction={editCallback} />
      ) : (
        <div />
      )}
    </div>
  );
};

const CoordinatorView = (props: BranchSelectorPropsType): JSX.Element => {
  const [query, setQuery] = useState<QueryType>(props.query);
  const [currentOperation, setCurrentOperation] = useState<OperationsType>();

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
      setCurrentOperation(OperationsType.Show);
    } else {
      setCurrentOperation(undefined);
    }
  }, [query]);

  const branchSelectorHeadline =
    query.path && query.path.length > 0
      ? "Next step"
      : "Where would you like to start?";
  const branchSelectorHeadlinePrefix =
    query.path &&
    query.path.length > 0 &&
    query.path[query.path.length - 1].notValue
      ? "Everything but "
      : "";

  const handleOperationsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const value = (event.currentTarget.textContent as string).toLowerCase();
    switch (value) {
      case OperationsType.Filter: {
        setCurrentOperation(OperationsType.Filter);
        break;
      }
      case OperationsType.Aggregate: {
        setCurrentOperation(OperationsType.Aggregate);
        break;
      }
      case OperationsType.Show: {
        setCurrentOperation(OperationsType.Show);
        break;
      }
      case OperationsType.Table: {
        setCurrentOperation(OperationsType.Table);
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

  const userWantsToFilterQuery: FilterCallbackType = (
    field,
    value,
    valueRange
  ) => {
    filterQuery(query, field, value, valueRange).then(newQuery => {
      setQuery(newQuery);
    });
  };

  const userWantsToTableQuery: TableCallbackType = (
    tableType,
    hasColumnNames,
    properties,
    columnNames
  ) => {
    createTableQuery(
      query,
      tableType,
      hasColumnNames,
      properties,
      columnNames
    ).then(newQuery => {
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
        <>
          {query.path && query.path.length > 1 && (
            <PastSteps path={query.path} handleStepBack={userWantsToStepBack} />
          )}
          {query.path && query.path.length > 0 && (
            <div>
              <Box>
                {query.path && (
                  <>
                    <CurrentStep
                      currentStep={query.path[query.path.length - 1]}
                      index={query.path.length - 1}
                      handleStepBack={userWantsToStepBack}
                    />
                  </>
                )}
                <div>
                  {renderStateButtons(handleOperationsClick, currentOperation)}
                </div>
              </Box>
              {currentOperation &&
                renderOperationsView(
                  currentOperation,
                  query,
                  userWantsToFilterQuery,
                  userWantsToTableQuery,
                  userWantsToAggregateQuery
                )}
            </div>
          )}
          <div>
            <BranchSelector
              query={query}
              headline={branchSelectorHeadlinePrefix + branchSelectorHeadline}
              followBranch={userWantsToFollowBranch}
            />
          </div>
        </>
      </ThemeProvider>
    </MainWrap>
  );
};

export default CoordinatorView;

export * from "./types";
