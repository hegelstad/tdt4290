import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TableCallbackType } from "../types";
import { PropertyType, PropertyTypes } from "core";
import {
  Box,
  HeaderAndButtonContainer,
  FloatRightButtonContainer
} from "./elements/Layout";
import { H3, H5 } from "./elements/Text";
import Button, { PrimaryButton } from "./elements/Button";

export const formatFieldName = (fieldName: string) => {
  let formatedFieldName: string = fieldName.split(/(?=[A-Z])|-|_/).join(" ");
  formatedFieldName =
    formatedFieldName[0].toUpperCase() + formatedFieldName.slice(1);
  return formatedFieldName;
};

const TableView = ({
  properties,
  callback
}: {
  properties: PropertyType[];
  callback: TableCallbackType;
}) => {
  const [fieldKeys, setFieldKeys] = useState<Array<PropertyType>>([
    {
      label: "",
      type: PropertyTypes.String
    }
  ]);
  const [columnNames, setColumnNames] = useState<Array<string>>([""]);
  const [hasColumnNames, setHasColumnNames] = useState<boolean>(false);
  const [autoFocusIndex, setAutoFocusIndex] = useState<number>(0);
  const [fieldsAreFilled, setFieldsAreFilled] = useState<boolean>(false);

  const menusAndFieldsAreFilled = () => {
    let newFieldsAreFilled: boolean = fieldKeys.find(property => {
      return property.label === "";
    })
      ? false
      : true;
    if (hasColumnNames && columnNames.includes("")) {
      newFieldsAreFilled = false;
    }
    setFieldsAreFilled(newFieldsAreFilled);
  };

  const handleFieldDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    key: number
  ) => {
    const newFieldKeys: Array<PropertyType> = fieldKeys;
    const property = properties.find(property => {
      return property.label === event.target.value;
    });

    property
      ? (newFieldKeys[key] = property)
      : (newFieldKeys[key] = { label: "", type: PropertyTypes.String });
    setFieldKeys(newFieldKeys);
    setAutoFocusIndex(key);
    menusAndFieldsAreFilled();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: number
  ) => {
    const newColumnNames: Array<any> = columnNames;
    newColumnNames[key] = event.target.value;
    setColumnNames(newColumnNames);
    setAutoFocusIndex(key);
    menusAndFieldsAreFilled();
  };

  const resetColumnNames = () => {
    const newColumnNames: Array<string> = [];
    for (let i = 0; i < columnNames.length; i++) {
      newColumnNames[i] = "";
    }
    setColumnNames(newColumnNames);
  };

  useEffect((): void => {
    menusAndFieldsAreFilled();
  }, [columnNames]);

  const handleSubmit = () => {
    if (fieldsAreFilled) {
      let tableType: string;
      if (fieldKeys.length === 1) {
        tableType = "single";
      } else {
        tableType = "multiple";
      }
      callback(tableType, hasColumnNames, fieldKeys, columnNames);
    }
  };

  const handleToggleColumnNamesInput = () => {
    resetColumnNames();
    setAutoFocusIndex(0);
    menusAndFieldsAreFilled();
    hasColumnNames ? setHasColumnNames(false) : setHasColumnNames(true);
  };

  const handleAddValueInputField = () => {
    let newFieldKeys: Array<PropertyType> = [];
    let newColumnNames: Array<any> = [];
    if (fieldKeys.length < 5 && columnNames.length < 5) {
      newFieldKeys = fieldKeys.concat({
        label: "",
        type: PropertyTypes.String
      });
      newColumnNames = columnNames.concat("");
      setFieldKeys(newFieldKeys);
      setColumnNames(newColumnNames);
      if (hasColumnNames) {
        setAutoFocusIndex(columnNames.length);
      }
    }
  };

  const handleRemoveValueInputField = () => {
    if (fieldKeys.length > 1 && columnNames.length > 1) {
      const newFieldKeys: Array<any> = fieldKeys.filter(
        (item, j) => j !== fieldKeys.length - 1 && item !== null
      );
      const newColumnNames: Array<any> = columnNames.filter(
        (item, j) => j !== columnNames.length - 1 && item !== null
      );
      setFieldKeys(newFieldKeys);
      setColumnNames(newColumnNames);
      setAutoFocusIndex(columnNames.length - 2);
    }
  };

  // styled components

  const componentHasProperties = (properties: string[]) => {
    return properties.length > 0;
  };

  const fieldIsSelected = (field: string) => {
    return fieldKeys.find(property => {
      return property.label === field;
    })
      ? true
      : false;
  };

  const ColumnNameInput = styled.input.attrs(() => ({
    type: "text"
  }))`
    padding: 2px;
    margin: 0 7% 8px 3%;
    width: 90%;
    height: 16px;
  `;

  const FieldSelect = styled.select`
    padding: 2px;
    margin: 0 3% 8px 7%;
    width: 90%;
    height: 24px;
  `;

  const AddColumnNameButton = styled(Button)`
    width: 10%;
    margin: 0 1% 20px 37%;
  `;

  const RemoveColumnNameButton = styled(Button)`
    width: 10%;
    margin: 0 0 20px 2%;
  `;

  const CenterButton = styled(Button)`
    margin-left: 20%;
  `;

  const FieldWrapper = styled.div`
    /*border-style: dotted;
  border-color: #0030F0;*/
    width: 48%;
    margin-bottom: 5px;
    margin-left: 1%;
  `;
  const ColumnNameWrapper = styled.div`
    /*border-style: dotted;
  border-color: #50FF00;*/
    width: 48%;
    float: right;
    margin-bottom: 5px;
    margin-right: 1%;
  `;

  const TableWrapper = styled.div`
    display: flex;
  `;

  return (
    // Put the option values in ValueRangeSelect in a list instead of hard coded
    <>
      {componentHasProperties(properties.map(property => property.label)) && (
        <Box>
          <HeaderAndButtonContainer>
            <H3>Table</H3>
          </HeaderAndButtonContainer>
          <TableWrapper>
            <FieldWrapper>
              <H5>
                Selected
                {fieldKeys.length === 1 ? " column" : " columns"}
              </H5>
              {fieldKeys.map((value, index) => (
                <FieldSelect
                  key={"tableFieldSelect" + value + index}
                  defaultValue={fieldKeys[index].label}
                  onChange={e => handleFieldDropDownChange(e, index)}
                >
                  <option key={"defaultTableFieldSelect"} value="" disabled>
                    --Choose field--
                  </option>
                  {properties.sort().map(prop => (
                    <option
                      key={prop.label}
                      value={prop.label}
                      disabled={fieldIsSelected(prop.label)}
                    >
                      {formatFieldName(prop.label)}
                    </option>
                  ))}
                </FieldSelect>
              ))}
            </FieldWrapper>

            {hasColumnNames && (
              <ColumnNameWrapper>
                <H5>
                  {"Custom " + (columnNames.length === 1 ? "name" : "names")}
                </H5>
                {columnNames.map((value, index) => (
                  <React.Fragment key={"ColumnNameInputFragment" + index}>
                    <ColumnNameInput
                      key={"ColumnNameInput" + index}
                      defaultValue={value}
                      onChange={e => handleInputChange(e, index)}
                      placeholder="Select a value..."
                      autoFocus={index === autoFocusIndex}
                    />
                  </React.Fragment>
                ))}
              </ColumnNameWrapper>
            )}
          </TableWrapper>
          <AddColumnNameButton
            text={"+"}
            disabled={fieldKeys.length === 5}
            onClick={handleAddValueInputField}
          />
          <RemoveColumnNameButton
            text={"-"}
            disabled={fieldKeys.length <= 1}
            onClick={handleRemoveValueInputField}
          />
          <br />
          <CenterButton
            onClick={handleToggleColumnNamesInput}
            text={
              hasColumnNames
                ? "Remove custom column names"
                : "Add custom column names"
            }
          />
          <FloatRightButtonContainer>
            <PrimaryButton
              text={"Apply"}
              onClick={() => handleSubmit()}
              disabled={!fieldsAreFilled}
            />
          </FloatRightButtonContainer>
        </Box>
      )}
    </>
  );
};

export default TableView;
