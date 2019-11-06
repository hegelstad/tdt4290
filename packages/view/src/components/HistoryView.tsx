import React from "react";
import styled from "styled-components";
import { BranchType, LabelType, EdgeType, FilterType } from "core";
import { Row, Column } from "./elements/Layout";

const HistoryWrap = styled.div`
  max-width: 200px;
  margin: 0 auto;
  padding-left 10px;
  border: 1px solid black;
  display: flex;
`;

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
  history,
  handleStepBack
}: {
  history: BranchType[];
  handleStepBack: () => void;
}) => {
  return history.length > 0 ? (
    <HistoryWrap>
      {history.length > 0 && <button onClick={handleStepBack}>Undo</button>}
      {history.map((branch, i) => (
        <Row key={i}>
          <Column>
            {branch.type === "label" ? (
              <LabelBranch index={i + 1} branch={branch} />
            ) : branch.type === "edge" ? (
              <EdgeBranch index={i + 1} branch={branch} />
            ) : (
              <FilterBranch index={i + 1} branch={branch} />
            )}
          </Column>
        </Row>
      ))}
    </HistoryWrap>
  ) : (
    <div />
  );
};

export default HistoryView;
