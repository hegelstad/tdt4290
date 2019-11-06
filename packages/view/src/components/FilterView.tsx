import React, { useState } from "react";
import styled from "styled-components";
import { FilterCallbackType } from "../types";
import { PropertyType } from "core";
import Dropdown from "./elements/Dropdown";
import { Box, Row } from "./elements/Layout";
import Button from "./elements/Button";

const FloatRightButton = styled(Button)`
  display: inline-block;
  display: inline-block;
  margin-left: auto;
`;

const FilterView = ({
  properties,
  callback
}: {
  properties: PropertyType[];
  callback: FilterCallbackType;
}): JSX.Element => {
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setFieldKey(event.target.value);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFieldValue(event.target.value);
  };

  const handleSubmit = (): void => {
    const property = properties.find(property => {
      return property.label === fieldKey;
    });
    if (property && fieldValue !== "") {
      callback(property, fieldValue);
    }
  };

  const componentHasFilter = (filters: string[]): boolean => {
    return filters.length > 0;
  };

  const formatFieldName = (fieldName: string): string => {
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

  return (
    <>
      {componentHasFilter(properties.map(property => property.label)) && (
        <Box>
          <Row>
            <h3>Filter</h3>
            <FloatRightButton text={"Do"} onClick={handleSubmit} floatRight />
          </Row>
          <Dropdown onChange={handleDropDownChange} value={fieldKey}>
            <option key={"default"} value="" disabled>
              --Choose field--
            </option>
            {properties.sort().map(prop => (
              <option key={prop.label} value={prop.label}>
                {formatFieldName(prop.label)}
              </option>
            ))}
          </Dropdown>
          <ValueInput placeholder="Select a value..." autoFocus />
        </Box>
      )}
    </>
  );
};

export default FilterView;
