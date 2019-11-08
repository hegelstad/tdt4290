import React from "react";
import {
  BranchType,
  LabelType,
  EdgeType,
  FilterType,
  TableType,
  AggregationType,
  ValueRangeTypes
} from "core";

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
        Filtering the field {branch.property.label} on value
        {findValueRangeText(branch.valueRange)}{" "}
        {branch.value.join(findValueSeparator(branch.valueRange))}
      </div>
    </div>
  );
};

const TableBranch = ({
  index,
  branch
}: {
  index: number;
  branch: TableType;
}) => {
  return (
    <div>
      <div>Step: {index}</div>
      <div>
        Created table on {branch.value.length > 1 ? "fields; " : "field "}
        {branch.value.map(prop => prop.label).join(", ")}{" "}
        {branch.hasColumnNames
          ? (branch.columnNames.length > 1
              ? "with column names: "
              : "with column name ") + branch.columnNames.join(", ")
          : ""}
      </div>
    </div>
  );
};

const AggregationBranch = ({
  index,
  branch
}: {
  index: number;
  branch: AggregationType;
}) => {
  return (
    <div>
      <div>Step: {index}</div>
      <div>
        Aggregated with {branch.method}-method on{" "}
        {branch.value.length > 1 ? "fields: " : "field: "}
        {branch.value.map(prop => prop.label).join(", ")}{" "}
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
        ) : branch.type === "filter" ? (
          <FilterBranch key={i} index={i + 1} branch={branch} />
        ) : branch.type === "table" ? (
          <TableBranch key={i} index={i + 1} branch={branch} />
        ) : (
          <AggregationBranch key={i} index={i + 1} branch={branch} />
        )
      )}
      {history.length > 0 && <button onClick={handleStepBack}>Undo</button>}
    </div>
  );
};

export default HistoryView;
