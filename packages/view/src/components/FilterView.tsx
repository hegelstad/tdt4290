import React, { useState } from "react";
import styled from "styled-components";
import { FilterCallbackType } from "../types/types";

const FilterView = ({
  properties,
  callback
}: {
  properties: string[];
  callback: FilterCallbackType;
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
      callback(fieldKey, fieldValue);
    }
  };

  const componentHasFilter = (filters: string[]) => {
    return filters.length > 0;
  };

  const formatFieldName = (fieldName: string) => {
    let formatedFieldName: string = fieldName.split(/(?=[A-Z])|-/).join(" ");
    formatedFieldName =
      formatedFieldName[0].toUpperCase() + formatedFieldName.slice(1);
    return formatedFieldName;
  };

  // styled components

  const ValueInput = styled.input.attrs(() => ({
    type: "text",
    defaultValue: fieldValue,
    onInput: handleInputChange
  }))`
    padding: 2px;
    margin: 0 19% 8px 17%;
    width: 60%;
  `;

  const FieldSelect = styled.select.attrs(() => ({
    defaultValue: fieldKey,
    onChange: handleDropDownChange
  }))`
    padding: 2px;
    margin: 0 18% 8px 17%;
    width: 62%;
  `;

  const FilterButton = styled.button.attrs(() => ({
    onClick: () => handleSubmit()
  }))`
    padding: 2px 5px;
    margin: 0 39% 8px 37%;
    width: 20%;
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
            {properties.sort().map(prop => (
              <option key={prop} value={prop}>
                {formatFieldName(prop)}
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
