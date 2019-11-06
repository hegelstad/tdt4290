import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FilterCallbackType } from "../types";
import { PropertyType, PropertyTypes } from "core";

const FilterView = ({
  properties,
  callback
}: {
  properties: PropertyType[];
  callback: FilterCallbackType;
}): JSX.Element => {
  const [fieldKey, setFieldKey] = useState<PropertyType>({
    label: "",
    type: PropertyTypes.String
  });
  const [fieldValues, setfieldValues] = useState<Array<any>>([]);
  const [valueRange, setValueRange] = useState<string>("");

  const handleFieldDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const property = properties.find(property => {
      return property.label === event.target.value;
    });
    property
      ? setFieldKey(property)
      : setFieldKey({ label: "", type: PropertyTypes.String });
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

  const typeIsANumber = (props: PropertyType) => {
    return props.type === PropertyTypes.Number;
  };

  useEffect(() => {
    let newFieldValues: Array<any> = [];
    if (
      !typeIsANumber(fieldKey) &&
      (valueRange === "gt" ||
        valueRange === "lt" ||
        valueRange === "inside" ||
        valueRange === "outside")
    ) {
      setValueRange("");
    } else if (
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
    if (fieldKey.label !== "" && fieldValues[0] !== "" && valueRange !== "") {
      callback(fieldKey, fieldValues, valueRange);
    }
  };

  const handleAddValueInputField = () => {
    let newFieldValues: Array<any> = [];
    if (fieldValues.length < 5) {
      newFieldValues = fieldValues.concat("");
      setfieldValues(newFieldValues);
    }
  };

  const handleRemoveValueInputField = () => {
    if (fieldValues.length > 1) {
      const newFieldValues: Array<any> = fieldValues.filter(
        (item, j) => j !== fieldValues.length - 1 && item !== null
      );
      setfieldValues(newFieldValues);
    }
  };
  const componentHasFilter = (filters: string[]): boolean => {
    return filters.length > 0;
  };

  const formatFieldName = (fieldName: string): string => {
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
    key: "fieldSelect",
    value: fieldKey.label,
    onChange: handleFieldDropDownChange
  }))`
    padding: 2px;
    margin: 0 28% 8px 27%;
    width: 42%;
  `;

  const ValueRangeSelect = styled.select.attrs(() => ({
    key: "valueRangeSelect",
    value: valueRange,
    onChange: handleValueRangeDropDownChange
  }))`
    padding: 2px;
    margin: 0 28% 8px 27%;
    width: 42%;
  `;

  const FilterButton = styled.button.attrs(() => ({
    onClick: (): void => handleSubmit()
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

  const dropDownIsDisabled = (key: string) => {
    return key !== "";
  };

  return (
    // Put the option values in ValueRangeSelect in a list instead of hard coded
    <>
      {componentHasFilter(properties.map(property => property.label)) && (
        <div>
          <h3>Filter</h3>
          <FilterLabel>Field:</FilterLabel>
          <FieldSelect>
            <option
              key={"defaultFieldSelect"}
              value=""
              disabled={dropDownIsDisabled(fieldKey.label)}
            >
              --Choose field--
            </option>
            {properties
              .sort((a, b) => (a.label > b.label ? 1 : -1))
              .map(prop => (
                <option key={"field" + prop.label} value={prop.label}>
                  {formatFieldName(prop.label)}
                </option>
              ))}
          </FieldSelect>
          <FilterLabel>Value Range:</FilterLabel>
          <ValueRangeSelect>
            <option
              key={"defaultValueRangeSelect"}
              value=""
              disabled={dropDownIsDisabled(valueRange)}
            >
              --Choose value range--
            </option>
            <option key={"valueRangeWithin"} value={"within"}>
              Among values
            </option>
            <option
              key={"valueRangeGt"}
              value={"gt"}
              disabled={!typeIsANumber(fieldKey)}
            >
              Greater than value
            </option>
            <option
              key={"valueRangeInside"}
              value={"inside"}
              disabled={!typeIsANumber(fieldKey)}
            >
              Inside range of values
            </option>
            <option
              key={"valueRangeLt"}
              value={"lt"}
              disabled={!typeIsANumber(fieldKey)}
            >
              Less than value
            </option>
            <option key={"valueRangeWithout"} value={"without"}>
              Not among values
            </option>
            <option key={"valueRangeNot"} value={"not"}>
              Not value
            </option>
            <option
              key={"valueRangeOutside"}
              value={"outside"}
              disabled={!typeIsANumber(fieldKey)}
            >
              Outside range of values
            </option>
            <option key={"valueRangeNormal"} value={"normal"}>
              Value
            </option>
          </ValueRangeSelect>
          {fieldValues.length === 1 && <FilterLabel>Value:</FilterLabel>}
          {fieldValues.length > 1 && <FilterLabel>Values:</FilterLabel>}
          {fieldValues.map((value, index) => (
            <>
              <ValueInput
                key={"valueInput" + index}
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
