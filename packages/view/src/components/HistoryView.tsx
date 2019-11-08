import React from "react";
import { BranchType, LabelType, EdgeType, FilterType } from "core";
import { Row, Column, HorizontalLine } from "./elements/Layout";
import { H3, H4, H5 } from "./elements/Text";
import Button from "./elements/Button";

const LabelBranch = ({ branch }: { branch: LabelType }) => {
  return (
    <div>
      <H5>Selected component:</H5>
      <p>{branch.value}</p>
    </div>
  );
};

const EdgeBranch = ({ branch }: { branch: EdgeType }) => {
  return (
    <div>
      <H5>Followed reference:</H5>
      <p>{branch.value}</p>
    </div>
  );
};

const FilterBranch = ({ branch }: { branch: FilterType }) => {
  return (
    <div>
      <div>
        Filtering the field {branch.property} on value {branch.value}
      </div>
    </div>
  );
};

const HistoryView = ({
  historyStep,
  index,
  handleStepBack,
  button
}: {
  historyStep: BranchType;
  index: number;
  handleStepBack: () => void;
  button?: boolean;
}) => {
  return (
    <div key={index}>
      {button ? (
        <Row>
          <H3>{"Current step"}</H3>
          <Button text={"Undo"} onClick={handleStepBack} floatRight />
        </Row>
      ) : (
        <Row>
          <H4>{"Past step"}</H4>
        </Row>
      )}
      <Row>
        <Column>
          <HorizontalLine />
          {historyStep.type === "label" ? (
            <LabelBranch branch={historyStep} />
          ) : historyStep.type === "edge" ? (
            <EdgeBranch branch={historyStep} />
          ) : (
            <FilterBranch branch={historyStep} />
          )}
        </Column>
      </Row>
    </div>
  );
};

export default HistoryView;
