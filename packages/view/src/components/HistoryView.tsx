import React from "react";
import { Box, HorizontalLine, FloatRightDiv } from "./elements/Layout";
import { H3, H4, H5 } from "./elements/Text";
import Button from "./elements/Button";
import styled from "styled-components";
import {
  BranchType,
  LabelType,
  EdgeType,
  FilterType,
  TableType,
  AggregationType,
  ValueRangeTypes
} from "core";

const HistoryRow = styled.div`
  max-height: ${props => props.theme.box.historyHeight};
`;

const findValueRangeText = (valueRange: ValueRangeTypes): string => {
  if (valueRange === ValueRangeTypes.Gt) {
    return "s greater than";
  } else if (valueRange === ValueRangeTypes.Inside) {
    return "s inside range";
  } else if (valueRange === ValueRangeTypes.Lt) {
    return "s less than";
  } else if (valueRange === ValueRangeTypes.Normal) {
    return "";
  } else if (valueRange === ValueRangeTypes.Not) {
    return "s not";
  } else if (valueRange === ValueRangeTypes.Outside) {
    return "s outside range";
  } else if (valueRange === ValueRangeTypes.Within) {
    return "s among:";
  } else if (valueRange === ValueRangeTypes.Without) {
    return "s not among:";
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
    <div>
      <div>
        Filtering the field {branch.property.label} on value
        {findValueRangeText(branch.valueRange)}{" "}
        {branch.value.join(findValueSeparator(branch.valueRange))}
      </div>
    </div>
  );
};

const LabelBranch = ({ branch }: { branch: LabelType }) => {
  return (
    <>
      <H5>
        {!branch.notValue
          ? "Selected component:"
          : "Selected everything other than: "}
      </H5>
      <p>{branch.value}</p>
    </>
  );
};

const EdgeBranch = ({ branch }: { branch: EdgeType }) => {
  return (
    <>
      <H5>
        {!branch.notValue
          ? "Followed reference:"
          : "Followed every other reference than: "}
      </H5>
      <p>{branch.value}</p>
    </>
  );
};

const TableBranch = ({ index, table }: { index: number; table: TableType }) => {
  return (
    <div>
      <div>Step: {index}</div>
      <div>
        Created table on {table.properties.length > 1 ? "fields; " : "field "}
        {table.properties.map(prop => prop.label).join(", ")}{" "}
        {table.hasColumnNames
          ? (table.columnNames.length > 1
              ? "with column names: "
              : "with column name ") + table.columnNames.join(", ")
          : ""}
      </div>
    </div>
  );
};

const AggregationBranch = ({
  index,
  aggregation
}: {
  index: number;
  aggregation: AggregationType;
}) => {
  return (
    <div>
      <div>Step: {index}</div>
      <div>
        Aggregated with {aggregation.method}-method on{" "}
        {aggregation.properties.length > 1 ? "fields: " : "field: "}
        {aggregation.properties.map(prop => prop.label).join(", ")}{" "}
      </div>
    </div>
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
          <H3>{"Current step"}</H3>
          <Button text={"X"} onClick={handleStepBack} floatRight />
        </FloatRightDiv>
      ) : (
        <div>
          <H4>{"Past step"}</H4>
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
    <AggregationBranch
      key={history.length}
      index={history.length + 1}
      aggregation={aggregation}
    />
  ) : table ? (
    <TableBranch
      key={history.length}
      index={history.length + 1}
      table={table}
    />
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
  console.log("CurrentStep: ", currentStep);
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
