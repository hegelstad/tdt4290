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
  OperationsType
} from "./types";
import { Box } from "./components/elements/Layout";
import { PrimaryButton } from "./components/elements/Button";

/**
 * STYLED COMPONENTS
 */
const OuterWrap = styled.div`
  display: flex;
`;

const InnerWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonWrap = styled.div`
  margin-top: 20px;
`;

const hasReachedEnd = (query: QueryType, operation: OperationsType) => {
  console.log("Operation: ", operation);
  if (operation === OperationsType.Show) {
    console.log("Show");
    console.log("");
    return false;
  } else if (query.aggregation !== undefined || query.table !== undefined) {
    console.log("Triggered");
    console.log("");
    // Operations buttons are always disabled if we have a Table or Aggregation
    return true;
  }
  console.log("Nothing");
  console.log("");
  return false;
};
const renderStateButtons = (
  handler: (event: React.MouseEvent<HTMLButtonElement>) => void,
  query: QueryType
) => {
  const buttons = [];
  for (const operation in OperationsType) {
    let text = operation.charAt(0).toUpperCase() + operation.slice(1);
    if (text === "Show") {
      text = "Show query";
    } else if (text === "Table") {
      text = "Create table";
    }
    let op: OperationsType;
    if (operation.toLowerCase() === OperationsType.Aggregate) {
      op = OperationsType.Aggregate;
    } else if (operation.toLowerCase() === OperationsType.Filter) {
      op = OperationsType.Filter;
    } else if (operation.toLowerCase() === "table") {
      op = OperationsType.Table;
    } else {
      op = OperationsType.Show;
    }
    buttons.push(
      <PrimaryButton
        key={text}
        text={text}
        onClick={handler}
        disabled={hasReachedEnd(query, op)}
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
      {currentOperation === OperationsType.Filter &&
      !hasReachedEnd(query, currentOperation) ? (
        <FilterView
          properties={query.properties || []}
          callback={filterCallback}
        />
      ) : currentOperation === OperationsType.Table &&
        !hasReachedEnd(query, currentOperation) ? (
        <TableView
          properties={query.properties || []}
          callback={tableCallback}
        />
      ) : currentOperation === OperationsType.Aggregate &&
        !hasReachedEnd(query, currentOperation) ? (
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
   * Unless the current operation is Show, and the query changes,
   * hide the operation
   */
  useEffect(() => {
    if (currentOperation != OperationsType.Show) {
      setCurrentOperation(undefined);
    }
  }, [query]);

  const branchSelectorHeadline =
    query.path && query.path.length > 0 ? "NEXT STEP" : "FIRST STEP";

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
          "Unkown operation. Expected 'filter', 'aggregate', 'create table' or 'show query'. Got: " +
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

  const hasAggregationOrTable =
    query.aggregation !== undefined || query.table !== undefined;

  return (
    <OuterWrap>
      <ThemeProvider theme={theme}>
        <InnerWrap>
          {query.path && query.path.length > 0 && (
            <PastSteps
              path={query.path}
              handleStepBack={userWantsToStepBack}
              renderLastStep={hasAggregationOrTable}
            />
          )}
          {query.path && query.path.length > 0 && (
            <div>
              <Box>
                {query.path && (
                  <>
                    <CurrentStep
                      currentStep={
                        hasAggregationOrTable
                          ? undefined
                          : query.path[query.path.length - 1]
                      }
                      index={query.path.length - 1}
                      aggregation={query.aggregation}
                      table={query.table}
                      handleStepBack={userWantsToStepBack}
                    />
                  </>
                )}
                <ButtonWrap>
                  {renderStateButtons(handleOperationsClick, query)}
                </ButtonWrap>
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
          {!hasAggregationOrTable && (
            <div>
              <BranchSelector
                query={query}
                headline={branchSelectorHeadline}
                followBranch={userWantsToFollowBranch}
              />
            </div>
          )}
        </InnerWrap>
      </ThemeProvider>
    </OuterWrap>
  );
};

export default CoordinatorView;

export * from "./types";
