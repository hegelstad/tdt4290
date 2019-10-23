import React, { useState } from "react";
import styled from "styled-components";
import { FilterQueryPropsType } from "../types/types";

const FilterView = ({
  properties,
  callback
}: {
  properties: string[];
  callback: (props: FilterQueryPropsType) => void;
}) => {
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFieldKey(event.target.value);
    console.log("FieldKey: " + fieldKey);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.value);
  };

  const handleSubmit = () => {
    if (fieldKey !== "" && fieldValue !== "") {
      callback({ field: fieldKey, value: fieldValue });
    }
  };

  const componentHasFilter = (filters: string[]) => {
    return filters.length > 0;
  };

  // styled components

  const ValueInput = styled.input.attrs(() => ({
    type: "text",
    defaultValue: fieldValue,
    onInput: handleInputChange
  }))`
    padding: 2px;
    margin-bottom: 8px;
    margin-left: 10px;
  `;

  const FieldSelect = styled.select.attrs(() => ({
    defaultValue: fieldKey,
    onChange: handleDropDownChange
  }))`
    padding: 2px;
    margin-bottom: 8px;
    margin-left: 18px;
  `;

  const FilterButton = styled.button.attrs(() => ({
    onClick: () => handleSubmit()
  }))`
    padding: 2px 5px;
    margin-bottom: 8px;
    margin-left: 10px;
  `;

  return (
    <>
      {componentHasFilter(properties) && (
        <div>
          <h3>Filter</h3>
          <FieldSelect>
            <option key={"default"} value="" disabled selected>
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
      )}
    </>
  );
};

export default FilterView;
