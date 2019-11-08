import React from "react";
import { BranchType, LabelType, EdgeType, FilterType } from "core";
import { Row, Column } from "./elements/Layout";
import Button from "./elements/Button";

const LabelBranch = ({
  index,
  branch
}: {
  index: number;
  branch: LabelType;
}) => {
  return (
    <div>
      <div>Step: {index}</div>
      <div>All related components with type: {branch.value}</div>
    </div>
  );
};

const EdgeBranch = ({ index, branch }: { index: number; branch: EdgeType }) => {
  return (
    <div>
      <div>Step: {index}</div>
      <div>Follow reference: {branch.value}</div>
    </div>
  );
};

const FilterBranch = ({
  index,
  branch
}: {
  index: number;
  branch: FilterType;
}) => {
  return (
    <div>
      <div>Step: {index}</div>
      <div>
        Filtering the field {branch.property} on value {branch.value}
      </div>
    </div>
  );
};

const HistoryView = ({
  historyStep,
  index,
  handleStepBack
}: {
  historyStep: BranchType;
  index: number;
  handleStepBack: () => void;
}) => {
  return (
    <div key={index}>
      <Row>
        {history.length > 0 && (
          <Button text={"X"} onClick={handleStepBack} floatRight />
        )}
      </Row>
      <Row>
        <Column>
          {historyStep.type === "label" ? (
            <LabelBranch index={index + 1} branch={historyStep} />
          ) : historyStep.type === "edge" ? (
            <EdgeBranch index={index + 1} branch={historyStep} />
          ) : (
            <FilterBranch index={index + 1} branch={historyStep} />
          )}
        </Column>
      </Row>
    </div>
  );
};

export default HistoryView;
