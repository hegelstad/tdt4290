import React, { useState, useEffect } from "react";
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
  const [fieldValues, setfieldValues] = useState<Array<any>>([]);
  const [valueRange, setValueRange] = useState<string>("");

  const handleFieldDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFieldKey(event.target.value);
  };

  const handleValueRangeDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValueRange(event.target.value);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: number
  ) => {
    const newFieldValues: Array<any> = fieldValues;
    newFieldValues[key] = event.target.value;
    setfieldValues(newFieldValues);
  };

  useEffect(() => {
    let newFieldValues: Array<any> = [];
    if (
      valueRange === "normal" ||
      valueRange === "not" ||
      valueRange === "within" ||
      valueRange === "without" ||
      valueRange === "gt" ||
      valueRange === "lt"
    ) {
      newFieldValues = [""];
    } else if (valueRange === "inside" || valueRange === "outside") {
      newFieldValues = ["", ""];
    }
    setfieldValues(newFieldValues);
  }, [valueRange, fieldKey]);

  const handleSubmit = () => {
    if (fieldKey !== "" && fieldValues[0] !== "" && valueRange !== "") {
      console.log("ValueRange: " + valueRange);
      callback(fieldKey, fieldValues, valueRange);
    }
  };

  const handleAddValueInputField = () => {
    let newFieldValues: Array<any> = [];
    if (fieldValues.length < 5) {
      newFieldValues = fieldValues.concat("");
      setfieldValues(newFieldValues);
    }
    console.log("after -> fieldValues: " + fieldValues);
  };

  const handleRemoveValueInputField = () => {
    if (fieldValues.length > 1) {
      const newFieldValues: Array<any> = fieldValues.filter(
        (item, j) => j !== fieldValues.length - 1 && item !== null
      );
      console.log(
        "handleRemoveValueInputField -> newFieldValues: " + newFieldValues
      );
      setfieldValues(newFieldValues);
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
    margin: 0 28% 8px 27%;
    width: 41%;
  `;

  const FieldSelect = styled.select.attrs(() => ({
    defaultValue: fieldKey,
    onChange: handleFieldDropDownChange
  }))`
    padding: 2px;
    margin: 0 28% 8px 27%;
    width: 42%;
  `;

  const ValueRangeSelect = styled.select.attrs(() => ({
    defaultValue: valueRange,
    onChange: handleValueRangeDropDownChange
  }))`
    padding: 2px;
    margin: 0 28% 8px 27%;
    width: 42%;
  `;

  const FilterButton = styled.button.attrs(() => ({
    onClick: () => handleSubmit()
  }))`
    padding: 2px 5px;
    margin: 5px 39% 8px 37%;
    width: 20%;
  `;

  const AddValueInputButton = styled.button.attrs(() => ({
    onClick: () => handleAddValueInputField()
  }))`
    width: 9%;
    margin: 0 1% 0 37%;
  `;

  const RemoveValueInputButton = styled.button.attrs(() => ({
    onClick: () => handleRemoveValueInputField()
  }))`
    width: 9%;
    margin: 0 37% 0 1%;
  `;

  const FilterLabel = styled.div`
    width: 20%;
    margin: 0 0 8px 27%;
  `;
  const InsideText = styled.div`
    width: 10%;
    margin: -2px 44% 6px 42%;
    text-align: center;
  `;

  return (
    // Put the option values in ValueRangeSelect in a list instead of hard coded
    <>
      {componentHasFilter(properties) && (
        <div>
          <h3>Filter</h3>
          <FilterLabel>Field:</FilterLabel>
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
          <FilterLabel>Value Range:</FilterLabel>
          <ValueRangeSelect>
            <option key={"default"} value="" disabled selected>
              --Choose value range--
            </option>
            <option key={"within"} value={"within"}>
              Among values
            </option>
            <option key={"gt"} value={"gt"}>
              Greater than value
            </option>
            <option key={"inside"} value={"inside"}>
              Inside range of values
            </option>
            <option key={"lt"} value={"lt"}>
              Less than value
            </option>
            <option key={"without"} value={"without"}>
              Not among values
            </option>
            <option key={"not"} value={"not"}>
              Not value
            </option>
            <option key={"outside"} value={"outside"}>
              Outside range of values
            </option>
            <option key={"normal"} value={"normal"}>
              Value
            </option>
          </ValueRangeSelect>
          {fieldValues.length === 1 && <FilterLabel>Value:</FilterLabel>}
          {fieldValues.length > 1 && <FilterLabel>Values:</FilterLabel>}
          {fieldValues.map((value, index) => (
            <>
              <ValueInput
                key={index}
                defaultValue={value}
                onChange={e => handleInputChange(e, index)}
                placeholder="Select a value..."
                autoFocus={index === 0}
              />
              {(valueRange === "inside" || valueRange === "outside") &&
                index === 0 && <InsideText>-</InsideText>}
            </>
          ))}
          {(valueRange === "within" || valueRange === "without") && (
            <>
              <AddValueInputButton disabled={fieldValues.length === 5}>
                +
              </AddValueInputButton>
              <RemoveValueInputButton disabled={fieldValues.length <= 1}>
                -
              </RemoveValueInputButton>
            </>
          )}
          <FilterButton disabled={fieldValues.length < 1}>Filter</FilterButton>
        </div>
      )}
    </>
  );
};

export default FilterView;
