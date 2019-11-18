import React from "react";
import { Box, HorizontalLine, FloatRightDiv } from "./elements/Layout";
import { H1, H4 } from "./elements/Text";
import Button from "./elements/Button";
import styled from "styled-components";
import {
  BranchType,
  LabelType,
  EdgeType,
  FilterType,
  TableType,
  AggregationType,
  ValueRangeTypes,
  MethodTypes
} from "core";

const HistoryRow = styled.div`
  max-height: ${props => props.theme.box.historyHeight};
  margin-left: auto;
`;

const findValueRangeText = (valueRange: ValueRangeTypes): string => {
  if (valueRange === ValueRangeTypes.Gt) {
    return "s greater than";
  } else if (valueRange === ValueRangeTypes.Inside) {
    return "s inside range";
  } else if (valueRange === ValueRangeTypes.Lt) {
    return "s less than";
  } else if (valueRange === ValueRangeTypes.Normal) {
    return " equal to";
  } else if (valueRange === ValueRangeTypes.Not) {
    return "s not equal to";
  } else if (valueRange === ValueRangeTypes.Outside) {
    return "s outside range";
  } else if (valueRange === ValueRangeTypes.Within) {
    return "s which are in the set:";
  } else if (valueRange === ValueRangeTypes.Without) {
    return "s which are not in the set:";
  }
  return "";
};

const findValueSeparator = (valueRange: ValueRangeTypes): string => {
  if (
    valueRange === ValueRangeTypes.Inside ||
    valueRange === ValueRangeTypes.Outside
  ) {
    return "-";
  }
  return ", ";
};

const FilterBranch = ({ branch }: { branch: FilterType }) => {
  return (
    <>
      <H4>Filtering components where</H4>
      <p>
        {branch.property.label + " has value"}
        {findValueRangeText(branch.valueRange) + " "}
        {branch.value.join(findValueSeparator(branch.valueRange))}
      </p>
    </>
  );
};

const LabelBranch = ({ branch }: { branch: LabelType }) => {
  return (
    <>
      <H4>
        {!branch.notValue
          ? "Selected component:"
          : "Selected everything that is not: "}
      </H4>
      <p>{branch.value}</p>
    </>
  );
};

const EdgeBranch = ({ branch }: { branch: EdgeType }) => {
  return (
    <>
      <H4>
        {!branch.notValue
          ? "Followed reference:"
          : "Followed every other reference than: "}
      </H4>
      <p>{branch.value}</p>
    </>
  );
};

const TableBranch = ({ table }: { table: TableType }) => {
  return (
    <>
      <H4>
        Created table with {table.properties.length > 1 ? "fields " : "field "}{" "}
      </H4>
      {table.properties.map((prop, i) => (
        <p key={"TableProp" + i}>{prop.label}</p>
      ))}
      {table.hasColumnNames ? (
        table.columnNames.length > 1 ? (
          <>
            <H4> and set column names </H4>
            <p>{table.columnNames.join(", ")}</p>
          </>
        ) : (
          <>
            <H4> and set column name </H4>
            <p>{table.columnNames.join(", ")}</p>
          </>
        )
      ) : (
        ""
      )}
    </>
  );
};

const AggregationBranch = ({
  aggregation
}: {
  aggregation: AggregationType;
}) => {
  return (
    <>
      {aggregation.method === MethodTypes.Count ? (
        <H4> Calculated the count</H4>
      ) : (
        <div>
          <H4>{"Calculated the " + aggregation.method + " of: "}</H4>
          {aggregation.properties.map((prop, i) => (
            <p key={"AggProp" + i}>{prop.label}</p>
          ))}
        </div>
      )}
    </>
  );
};

const HistoryView = ({
  historyStep,
  index,
  aggregation,
  table,
  handleStepBack,
  button
}: {
  historyStep?: BranchType;
  index: number;
  aggregation?: AggregationType;
  table?: TableType;
  handleStepBack: () => void;
  button?: boolean;
}) => {
  return historyStep ? (
    <div key={index}>
      {button ? (
        <FloatRightDiv>
          <H1>CURRENT STEP</H1>
          <Button text={"X"} onClick={handleStepBack} floatRight />
        </FloatRightDiv>
      ) : (
        <div>
          <H4>PAST STEP</H4>
        </div>
      )}
      <div>
        <HorizontalLine />
        {historyStep.type === "label" ? (
          <LabelBranch branch={historyStep} />
        ) : historyStep.type === "edge" ? (
          <EdgeBranch branch={historyStep} />
        ) : (
          <FilterBranch branch={historyStep} />
        )}
      </div>
    </div>
  ) : aggregation ? (
    <div key={index}>
      <FloatRightDiv>
        <H1>CURRENT STEP</H1>
        <Button text={"X"} onClick={handleStepBack} floatRight />
      </FloatRightDiv>
      <HorizontalLine />
      <AggregationBranch key={history.length} aggregation={aggregation} />
    </div>
  ) : table ? (
    <div key={index}>
      <FloatRightDiv>
        <H1>CURRENT STEP</H1>
        <Button text={"X"} onClick={handleStepBack} floatRight />
      </FloatRightDiv>
      <TableBranch key={history.length} table={table} />
    </div>
  ) : (
    <div />
  );
};

export const CurrentStep = ({
  currentStep,
  index,
  aggregation,
  table,
  handleStepBack
}: {
  currentStep?: BranchType;
  index: number;
  aggregation?: AggregationType;
  table?: TableType;
  handleStepBack: () => void;
}) => {
  return (
    <div>
      <HistoryView
        historyStep={currentStep}
        aggregation={aggregation}
        table={table}
        index={index}
        handleStepBack={handleStepBack}
        button
      />
    </div>
  );
};

export const PastSteps = ({
  path,
  handleStepBack,
  renderLastStep
}: {
  path: BranchType[];
  handleStepBack: () => void;
  renderLastStep?: boolean;
}) => {
  return (
    <>
      {path
        .filter((step, index) => {
          return (
            (step && index < path.length - 1) ||
            (index === path.length - 1 && renderLastStep)
          );
        })
        .map((step, index) => {
          return (
            <HistoryRow key={"History" + step.value + index}>
              <Box>
                <HistoryView
                  historyStep={step}
                  index={index}
                  handleStepBack={handleStepBack}
                />
              </Box>
            </HistoryRow>
          );
        })}
    </>
  );
};

export default HistoryView;
