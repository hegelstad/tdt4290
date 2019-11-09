import React from "react";
import { BranchType, LabelType, EdgeType, FilterType } from "core";
import { Box, HorizontalLine } from "./elements/Layout";
import { H3, H4, H5 } from "./elements/Text";
import Button from "./elements/Button";
import styled from "styled-components";

const HistoryRow = styled.div`
  max-height: ${props => props.theme.box.historyHeight};
`;

/*
const HistoryWrap = styled.div`
  width: 100%;
`;
*/

const LabelBranch = ({ branch }: { branch: LabelType }) => {
  return (
    <div>
      <H5>
        {!branch.notValue
          ? "Selected component:"
          : "Selected everything other than: "}
      </H5>
      <p>{branch.value}</p>
    </div>
  );
};

const EdgeBranch = ({ branch }: { branch: EdgeType }) => {
  return (
    <div>
      <H5>
        {!branch.notValue
          ? "Followed reference:"
          : "Followed every other reference than: "}
      </H5>
      <p>{branch.value}</p>
    </div>
  );
};

const FilterBranch = ({ branch }: { branch: FilterType }) => {
  return (
    <div>
      <div>
        Filtering the field {branch.property.label} on value {branch.value}
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
  return historyStep ? (
    <div key={index}>
      {button ? (
        <div>
          <H3>{"Current step"}</H3>
          <Button text={"Undo"} onClick={handleStepBack} floatRight />
        </div>
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
  ) : (
    <div />
  );
};

export const CurrentStep = ({
  currentStep,
  index,
  handleStepBack
}: {
  currentStep: BranchType;
  index: number;
  handleStepBack: () => void;
}) => {
  return (
    <div>
      <HistoryView
        historyStep={currentStep}
        index={index}
        handleStepBack={handleStepBack}
        button
      />
    </div>
  );
};

export const PastSteps = ({
  path,
  handleStepBack
}: {
  path: BranchType[];
  handleStepBack: () => void;
}) => {
  return (
    <>
      {path
        .filter((step, index) => {
          return step && index < path.length - 1;
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
