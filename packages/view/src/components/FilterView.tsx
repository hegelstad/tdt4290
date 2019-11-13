import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FilterCallbackType } from "../types";
import { PropertyType, PropertyTypes, ValueRangeTypes } from "core";
import { Box, FloatRightDiv } from "./elements/Layout";
import Dropdown from "./elements/Dropdown";
import { H3, H5 } from "./elements/Text";
import Input from "./elements/Input";
import Button from "./elements/Button";

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
  const [fieldValues, setfieldValues] = useState<Array<string>>([]);
  const [valueRange, setValueRange] = useState<ValueRangeTypes>(
    ValueRangeTypes.Undefined
  );
  const [fieldsAreFilled, setFieldsAreFilled] = useState<boolean>(false);
  const [autoFocusIndex, setAutoFocusIndex] = useState<number>(0);

  const menusAndFieldsAreFilled = () => {
    const newFieldsAreFilled: boolean =
      fieldKey.label !== "" &&
      !fieldValues.includes("") &&
      valueRange !== ValueRangeTypes.Undefined;
    setFieldsAreFilled(newFieldsAreFilled);
  };

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
  ): void => {
    let newValueRange: ValueRangeTypes;
    switch (event.target.value) {
      case ValueRangeTypes.Gt:
        newValueRange = ValueRangeTypes.Gt;
        break;
      case ValueRangeTypes.Inside:
        newValueRange = ValueRangeTypes.Inside;
        break;
      case ValueRangeTypes.Lt:
        newValueRange = ValueRangeTypes.Lt;
        break;
      case ValueRangeTypes.Normal:
        newValueRange = ValueRangeTypes.Normal;
        break;
      case ValueRangeTypes.Not:
        newValueRange = ValueRangeTypes.Not;
        break;
      case ValueRangeTypes.Outside:
        newValueRange = ValueRangeTypes.Outside;
        break;
      case ValueRangeTypes.Within:
        newValueRange = ValueRangeTypes.Within;
        break;
      case ValueRangeTypes.Without:
        newValueRange = ValueRangeTypes.Without;
        break;
      default:
        newValueRange = ValueRangeTypes.Undefined;
        break;
    }
    setValueRange(newValueRange);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: number
  ): void => {
    const newFieldValues: Array<any> = fieldValues;
    newFieldValues[key] = event.target.value;
    setfieldValues(newFieldValues);
    setAutoFocusIndex(key);
    menusAndFieldsAreFilled();
  };

  const typeIsANumber = (props: PropertyType): boolean => {
    return props.type === PropertyTypes.Number;
  };
  const typeIsAString = (props: PropertyType): boolean => {
    return (
      props.type === PropertyTypes.String ||
      props.type === PropertyTypes.StringArray
    );
  };

  useEffect((): void => {
    menusAndFieldsAreFilled();
  }, [fieldValues]);

  useEffect((): void => {
    let newFieldValues: Array<any> = [];
    if (
      !typeIsANumber(fieldKey) &&
      (valueRange === ValueRangeTypes.Gt ||
        valueRange === ValueRangeTypes.Lt ||
        valueRange === ValueRangeTypes.Inside ||
        valueRange === ValueRangeTypes.Outside)
    ) {
      setValueRange(ValueRangeTypes.Undefined);
    } else if (
      !typeIsAString(fieldKey) &&
      (valueRange === ValueRangeTypes.Within ||
        valueRange === ValueRangeTypes.Without)
    ) {
      setValueRange(ValueRangeTypes.Undefined);
    } else if (
      valueRange === ValueRangeTypes.Normal ||
      valueRange === ValueRangeTypes.Not ||
      valueRange === ValueRangeTypes.Within ||
      valueRange === ValueRangeTypes.Without ||
      valueRange === ValueRangeTypes.Gt ||
      valueRange === ValueRangeTypes.Lt
    ) {
      newFieldValues = [""];
    } else if (
      valueRange === ValueRangeTypes.Inside ||
      valueRange === ValueRangeTypes.Outside
    ) {
      newFieldValues = ["", ""];
    }
    setfieldValues(newFieldValues);
    setAutoFocusIndex(0);
  }, [valueRange, fieldKey]);

  const handleSubmit = (): void => {
    if (fieldsAreFilled) {
      callback(fieldKey, fieldValues, valueRange);
    }
  };

  const handleAddValueInputField = (): void => {
    let newFieldValues: Array<any> = [];
    if (fieldValues.length < 5) {
      newFieldValues = fieldValues.concat("");
      setfieldValues(newFieldValues);
      setAutoFocusIndex(fieldValues.length);
    }
  };

  const handleRemoveValueInputField = (): void => {
    if (fieldValues.length > 1) {
      const newFieldValues: Array<any> = fieldValues.filter(
        (item, j) => j !== fieldValues.length - 1 && item !== null
      );
      setfieldValues(newFieldValues);
      setAutoFocusIndex(fieldValues.length - 2);
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

  const InsideText = styled.div`
    width: 10%;
    margin: -2px 56% 6px 34%;
    text-align: center;
  `;

  const fieldDropDownIsDisabled = (): boolean => {
    return fieldKey.label !== "";
  };
  const valueRangeDropDownIsDisabled = (): boolean => {
    return valueRange !== ValueRangeTypes.Undefined;
  };

  return (
    // Put the option values in ValueRangeSelect in a list instead of hard coded
    <>
      {componentHasFilter(properties.map(property => property.label)) && (
        <Box>
          <FloatRightDiv>
            <H3>Filter</H3>
            <Button
              text={"Apply"}
              disabled={!fieldsAreFilled}
              onClick={handleSubmit}
              floatRight
            />
          </FloatRightDiv>
          <H5>Choose components where</H5>
          <Dropdown value={fieldKey.label} onChange={handleFieldDropDownChange}>
            <option
              key={"defaultFieldSelect"}
              value=""
              disabled={fieldDropDownIsDisabled()}
            >
              --choose field--
            </option>
            {properties
              .sort((a, b) => (a.label > b.label ? 1 : -1))
              .map(prop => (
                <option key={"field" + prop.label} value={prop.label}>
                  {formatFieldName(prop.label)}
                </option>
              ))}
          </Dropdown>
          <H5>is</H5>
          <Dropdown
            onChange={handleValueRangeDropDownChange}
            value={valueRange}
          >
            <option
              key={"defaultValueRangeSelect"}
              value={ValueRangeTypes.Undefined}
              disabled={valueRangeDropDownIsDisabled()}
            >
              --Choose value range--
            </option>
            <option
              key={"valueRangeWithin"}
              value={ValueRangeTypes.Within}
              disabled={!typeIsAString(fieldKey)}
            >
              Among values
            </option>
            <option
              key={"valueRangeGt"}
              value={ValueRangeTypes.Gt}
              disabled={!typeIsANumber(fieldKey)}
            >
              Greater than value
            </option>
            <option
              key={"valueRangeInside"}
              value={ValueRangeTypes.Inside}
              disabled={!typeIsANumber(fieldKey)}
            >
              Inside range of values
            </option>
            <option
              key={"valueRangeLt"}
              value={ValueRangeTypes.Lt}
              disabled={!typeIsANumber(fieldKey)}
            >
              Less than value
            </option>
            <option
              key={"valueRangeWithout"}
              value={ValueRangeTypes.Without}
              disabled={!typeIsAString(fieldKey)}
            >
              Not among values
            </option>
            <option key={"valueRangeNot"} value={ValueRangeTypes.Not}>
              Not value
            </option>
            <option
              key={"valueRangeOutside"}
              value={ValueRangeTypes.Outside}
              disabled={!typeIsANumber(fieldKey)}
            >
              Outside range of values
            </option>
            <option key={"valueRangeNormal"} value={ValueRangeTypes.Normal}>
              Value
            </option>
          </Dropdown>
          {fieldValues.length > 0 && (
            <H5>{fieldValues.length === 1 ? "Value:" : "Values:"}</H5>
          )}
          {fieldValues.map((value, index) => (
            <React.Fragment key={"valueInputFragment" + index}>
              <Input
                key={"valueInput" + index}
                defaultValue={value}
                onChange={e => handleInputChange(e, index)}
                placeholder="Enter a value..."
                autoFocus={index === autoFocusIndex}
              />
              {(valueRange === ValueRangeTypes.Inside ||
                valueRange === ValueRangeTypes.Outside) &&
                index === 0 && <InsideText>-</InsideText>}
            </React.Fragment>
          ))}
          {(valueRange === ValueRangeTypes.Within ||
            valueRange === ValueRangeTypes.Without) && (
            <>
              <AddValueInputButton disabled={fieldValues.length === 5}>
                +
              </AddValueInputButton>
              <RemoveValueInputButton disabled={fieldValues.length <= 1}>
                -
              </RemoveValueInputButton>
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default FilterView;
