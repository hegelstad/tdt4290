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

const PrimaryButton = styled(Button)`
  color: ${props => props.theme.colors.button.primaryText};
  background-color: ${props => props.theme.colors.button.primaryBackground};
  border-radius: ${props => props.theme.roundRadius};
  border-color: ${props => props.theme.colors.button.primaryBackground};

  :hover {
    background-color: ${props => props.theme.colors.button.primaryHover};
  }
`;

const renderStateButtons = (
  handler: (event: React.MouseEvent<HTMLButtonElement>) => void
) => {
  const buttons = [];
  for (const operation in OperationsType) {
    let text = operation.charAt(0).toUpperCase() + operation.slice(1);
    if (text === "Show") {
      text = "Show query";
    } else if (text === "Table") {
      text = "Create table";
    }
    buttons.push(<PrimaryButton key={text} text={text} onClick={handler} />);
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
    <MainWrap>
      <ThemeProvider theme={theme}>
        <>
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
                <div>{renderStateButtons(handleOperationsClick)}</div>
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
        </>
      </ThemeProvider>
    </MainWrap>
  );
};

export default CoordinatorView;

export * from "./types";
