import React, { useState } from "react";
import styled from "styled-components";
import { FilterCallbackType } from "../types";

const FilterView = ({
  properties,
  callback
}: {
  properties: string[];
  callback: FilterCallbackType;
}) => {
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValues, setfieldValues] = useState<Array<any>>(["", ""]);
  const [valueRange, setValueRange] = useState<string>("");

  const handleFieldDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFieldKey(event.target.value);
    console.log("FieldKey: " + fieldKey);
  };

  const handleValueRangeDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValueRange(event.target.value);
    console.log("ValueRange: " + valueRange);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: number
  ) => {
    console.log("id: " + key);
    const newFieldValues: Array<any> = fieldValues;
    console.log("newFieldValues before change: " + newFieldValues);
    newFieldValues[key] = event.target.value;
    console.log("newFieldValues after change: " + newFieldValues);
    setfieldValues(newFieldValues);
  };

  const handleSubmit = () => {
    //let value;
    if (fieldKey !== "" && fieldValues[0] !== "" && valueRange !== "") {
      /*if (!isNaN(fieldValues) && fieldValues.toString().indexOf(".") != -1) {
        value = parseFloat(fieldValues);
      } else {
        value = fieldValues;
      }*/
      //console.log("fieldValues type: " + typeof value);
      console.log("ValueRange: " + valueRange);
      callback(fieldKey, fieldValues, valueRange);
    }
  };

  const componentHasFilter = (filters: string[]) => {
    return filters.length > 0;
  };

  const formatFieldName = (fieldName: string) => {
    let formatedFieldName: string = fieldName.split(/(?=[A-Z])|-|_/).join(" ");
    formatedFieldName =
      formatedFieldName[0].toUpperCase() + formatedFieldName.slice(1);
    return formatedFieldName;
  };

  // styled components

  const ValueInput = styled.input.attrs(() => ({
    type: "text"
  }))`
    padding: 2px;
    margin: 0 19% 8px 17%;
    width: 60%;
  `;

  const FieldSelect = styled.select.attrs(() => ({
    defaultValue: fieldKey,
    onChange: handleFieldDropDownChange
  }))`
    padding: 2px;
    margin: 0 18% 8px 17%;
    width: 62%;
  `;

  const ValueRangeSelect = styled.select.attrs(() => ({
    defaultValue: valueRange,
    onChange: handleValueRangeDropDownChange
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
          <ValueRangeSelect>
            <option key={"default"} value="" disabled selected>
              --Choose value range--
            </option>
            <option key={"normal"} value={"normal"}>
              Value
            </option>
            <option key={"not"} value={"not"}>
              Not value
            </option>
            <option key={"within"} value={"within"}>
              Within values
            </option>
            <option key={"without"} value={"without"}>
              Without values
            </option>
          </ValueRangeSelect>
          <ValueInput
            key={0}
            defaultValue={fieldValues[0]}
            onChange={e => handleInputChange(e, 0)}
            placeholder="Select a value..."
            autoFocus
          />
          <ValueInput
            key={1}
            defaultValue={fieldValues[1]}
            onChange={e => handleInputChange(e, 1)}
            placeholder="Select a value..."
            autoFocus
          />
          <FilterButton>Filter</FilterButton>
        </div>
      )}
    </>
  );
};

export default FilterView;
