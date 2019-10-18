import React, { useState } from "react";
import styled from "styled-components";

const FilterView = ({
  properties,
  callback
}: {
  properties: string[];
  callback: any;
}) => {
  const [filterKey, setFilterKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterKey(event.target.value);
    console.log("FilterKey: " + filterKey);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.value);
  };

  const handleSubmit = (callback: any) => {
    if (filterKey !== "" && fieldValue !== "") {
      callback(filterKey, fieldValue);
    }
  };

  const componentHasFilter = (filters: string[]) => {
    if (filters.length > 0) {
      return true;
    }
    return false;
  };

  // styled components

  const ValueInput = styled.input.attrs(() => ({
    type: "text",
    defaultValue: fieldValue,
    onInput: handleInputChange
  }))`
  padding: 2px
    margin-bottom: 8px
    margin-left: 10px;
  `;

  const FieldSelect = styled.select.attrs(() => ({
    defaultValue: filterKey,
    onChange: handleDropDownChange
  }))`
  padding: 2px
    margin-bottom: 8px
    margin-left: 18px;
  `;

  const FilterButton = styled.button.attrs(() => ({
    onClick: () => handleSubmit(callback)
  }))`
  padding: 2px 5px
    margin-bottom: 8px
    margin-left: 10px;
  `;

  return (
    <div>
      {componentHasFilter(properties) ? (
        <div>
          <h3>Filter</h3>
          <FieldSelect>
            <option key={"default"} value="">
              --Choose field--
            </option>
            {properties.map(prop => (
              <option key={prop} value={prop}>
                {prop}
              </option>
            ))}
          </FieldSelect>
          <ValueInput placeholder="Select a value..." autoFocus />
          <FilterButton>Filter</FilterButton>
        </div>
      ) : null}
    </div>
  );
};

export default FilterView;
