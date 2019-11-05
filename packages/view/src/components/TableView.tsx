import React, { useState } from "react";
import styled from "styled-components";
import { TableCallbackType } from "../types";

const TableView = ({
  properties,
  callback
}: {
  properties: string[];
  callback: TableCallbackType;
}) => {
  const [fieldKeys, setFieldKeys] = useState<Array<any>>([""]);
  const [columnNames, setColumnNames] = useState<Array<any>>([""]);
  const [hasColumnNames, setHasColumnNames] = useState<boolean>(false);

  const handleFieldDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    key: number
  ) => {
    const newFieldKeys: Array<any> = fieldKeys;
    newFieldKeys[key] = event.target.value;
    setFieldKeys(newFieldKeys);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: number
  ) => {
    const newColumnNames: Array<any> = columnNames;
    newColumnNames[key] = event.target.value;
    setColumnNames(newColumnNames);
  };

  const handleSubmit = () => {
    if (fieldKeys[0] !== "") {
      let tableType: string;
      if (fieldKeys.length === 1) {
        tableType = "single";
      } else {
        tableType = "mulitple";
      }
      callback(tableType, hasColumnNames, fieldKeys, columnNames);
    }
  };

  const handleToggleColumnNamesInput = () => {
    hasColumnNames ? setHasColumnNames(false) : setHasColumnNames(true);
  };

  const handleAddValueInputField = () => {
    let newFieldKeys: Array<any> = [];
    let newColumnNames: Array<any> = [];
    if (fieldKeys.length < 5 && columnNames.length < 5) {
      newFieldKeys = fieldKeys.concat("");
      newColumnNames = columnNames.concat("");
      setFieldKeys(newFieldKeys);
      setColumnNames(newColumnNames);
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
    }
  };

  const formatFieldName = (fieldName: string) => {
    let formatedFieldName: string = fieldName.split(/(?=[A-Z])|-|_/).join(" ");
    formatedFieldName =
      formatedFieldName[0].toUpperCase() + formatedFieldName.slice(1);
    return formatedFieldName;
  };

  // styled components

  const componentHasProperties = (properties: string[]) => {
    return properties.length > 0;
  };
  const ColumnNameInput = styled.input.attrs(() => ({
    type: "text"
  }))`
    padding: 2px;
    margin: 0 28% 8px 10%;
    width: 65%;
  `;

  const FieldSelect = styled.select`
    padding: 2px;
    margin: 0 7% 8px 27%;
    width: 65%;
  `;

  const TableButton = styled.button.attrs(() => ({}))`
    padding: 2px 5px;
    margin: 5px 39% 8px 37%;
    width: 20%;
  `;

  const AddColumnNameButton = styled.button.attrs(() => ({
    onClick: () => handleAddValueInputField()
  }))`
    width: 9%;
    margin: 0 1% 0 37%;
  `;

  const RemoveColumnNameButton = styled.button.attrs(() => ({
    onClick: () => handleRemoveValueInputField()
  }))`
    width: 9%;
    margin: 0 37% 0 1%;
  `;

  const FieldLabel = styled.div`
    width: 30%;
    margin: 0 0 8px 27%;
  `;

  const ColumnNameLabel = styled.div`
    width: 30%;
    margin: 0 0 8px 10%;
  `;
  const FieldWrapper = styled.div`
    /*border-style: dotted;
  border-color: #0030F0;*/
    width: 46%;
    margin-bottom: 20px;
  `;
  const ColumnNameWrapper = styled.div`
    /*border-style: dotted;
  border-color: #50FF00;*/
    width: 48%;
    float: right;
    margin-bottom: 20px;
  `;

  const TableWrapper = styled.div`
    display: flex;
  `;

  return (
    // Put the option values in ValueRangeSelect in a list instead of hard coded
    <>
      {componentHasProperties(properties) && (
        <div>
          <h3>Table:</h3>
          <TableWrapper>
            <FieldWrapper>
              <FieldLabel>
                {fieldKeys.length === 1 ? "Field:" : "Fields:"}
              </FieldLabel>
              {fieldKeys.map((value, index) => (
                <>
                  <FieldSelect
                    key={index}
                    defaultValue={fieldKeys[index]}
                    onChange={e => handleFieldDropDownChange(e, index)}
                  >
                    <option key={value} value="" disabled selected>
                      --Choose field--
                    </option>
                    {properties.sort().map(prop => (
                      <option key={prop} value={prop}>
                        {formatFieldName(prop)}
                      </option>
                    ))}
                  </FieldSelect>
                </>
              ))}
            </FieldWrapper>

            {hasColumnNames && (
              <ColumnNameWrapper>
                <>
                  <ColumnNameLabel>
                    {columnNames.length === 1
                      ? "Column name:"
                      : "Column names:"}
                  </ColumnNameLabel>
                  {columnNames.map((value, index) => (
                    <>
                      <ColumnNameInput
                        key={index}
                        defaultValue={value}
                        onChange={e => handleInputChange(e, index)}
                        placeholder="Select a value..."
                        autoFocus={index === 0}
                      />
                    </>
                  ))}
                </>
              </ColumnNameWrapper>
            )}
          </TableWrapper>
          <AddColumnNameButton disabled={fieldKeys.length === 5}>
            +
          </AddColumnNameButton>
          <RemoveColumnNameButton disabled={fieldKeys.length <= 1}>
            -
          </RemoveColumnNameButton>
          <TableButton onClick={() => handleToggleColumnNamesInput()}>
            {hasColumnNames ? "Hide column names" : "Show column Names"}
          </TableButton>
          <TableButton
            onClick={() => handleSubmit()}
            disabled={fieldKeys.length < 1}
          >
            Create table query
          </TableButton>
        </div>
      )}
    </>
  );
};

export default TableView;
