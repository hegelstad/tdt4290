import React from "react";
import { BranchType, LabelType, EdgeType, FilterType } from "core";

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
        Filtering the field {branch.property.label} on value {branch.value}
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
  return (
    <div>
      {history.map((branch, i) =>
        branch.type === "label" ? (
          <LabelBranch key={i} index={i + 1} branch={branch} />
        ) : branch.type === "edge" ? (
          <EdgeBranch key={i} index={i + 1} branch={branch} />
        ) : (
          <FilterBranch key={i} index={i + 1} branch={branch} />
        )
      )}
      {history.length > 0 && <button onClick={handleStepBack}>Undo</button>}
    </div>
  );
};

export default HistoryView;
