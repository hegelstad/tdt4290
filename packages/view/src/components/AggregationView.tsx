import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  PropertyType,
  PropertyTypes,
  MethodTypes,
  AggregationType
} from "core";
import { AggregationViewPropsType } from "../types";

const AggregationView = (props: AggregationViewPropsType): JSX.Element => {
  /**
   * HOOKS
   */

  const [numericalProperties, setNumericalProperties] = useState<
    PropertyType[]
  >([]);
  const [selectedMethod, setSelectedMethod] = useState<MethodTypes>(
    MethodTypes.Mean
  );
  const [selectedProperties, setSelectedProperties] = useState<PropertyType[]>(
    []
  );

  useEffect(() => {
    if (props.query.properties) {
      setNumericalProperties(
        props.query.properties.filter(property => {
          return property.type === PropertyTypes.Number;
        })
      );
    }
  }, [props.query]);

  /**
   * PRIVATE METHODS
   */

  const __methodIsSelected = (methodName: string): boolean => {
    return selectedMethod === methodName;
  };

  const __propertyIsChecked = (propertyName: string): boolean => {
    return (
      selectedProperties.find(selectedProperty => {
        return selectedProperty.label === propertyName;
      }) !== undefined
    );
  };

  /**
   * HANDLERS
   */

  const handleMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    console.log("Event: ", event);
    console.log("Radio button value: ", value);
    switch (value) {
      case MethodTypes.Mean: {
        setSelectedMethod(MethodTypes.Mean);
        break;
      }
      case MethodTypes.Sum: {
        setSelectedMethod(MethodTypes.Sum);
        break;
      }
      default: {
        throw new Error("Unknown methodtype. Can't aggregate on " + value);
      }
    }
  };

  const handlePropertyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    console.log("Selected Properties: ", selectedProperties);
    console.log("Value: ", value);

    // Find the property that the checkbox was build from
    const property = numericalProperties.find(property => {
      return property.label === value;
    });
    console.log("Property: ", property);

    // Find the index in the array of the property found above
    const i = selectedProperties.indexOf(
      property ? property : { label: "", type: PropertyTypes.Undefined },
      0
    );

    console.log("i: ", i);

    if (property && i === -1) {
      // If the unwrapping was successful, and it does not
      // exist already in selected, add the property
      setSelectedProperties([...selectedProperties, property]);
    } else if (property && i !== -1) {
      // If the unwrapping was successful, and it does exist
      // already in selected, delete the property
      setSelectedProperties(
        selectedProperties.filter(selectedProperty => {
          return selectedProperty !== property;
        })
      );
    }
  };

  const handleClickDone = (): void => {
    if (selectedProperties.length > 0) {
      const aggregation: AggregationType = {
        method: selectedMethod,
        properties: selectedProperties
      };
      console.log("Aggregation: ", aggregation);
      props.callback(aggregation);
    }
  };

  /**
   * RENDERERS
   */

  const renderRadioButton = (
    text: string,
    handler: (event: React.ChangeEvent<HTMLInputElement>) => void,
    isSelected: (text: string) => boolean
  ): JSX.Element => {
    return (
      <div key={text}>
        <RadioButton
          onChange={handler}
          value={text}
          checked={isSelected(text)}
        />
        {" " + text}
        <br />
      </div>
    );
  };

  const renderCheckbox = (
    text: string,
    handler: (event: React.ChangeEvent<HTMLInputElement>) => void,
    isChecked: (text: string) => boolean
  ): JSX.Element => {
    return (
      <div key={text}>
        <div key={text}>
          <CheckBox onChange={handler} value={text} checked={isChecked(text)} />
          {" " + text}
          <br />
        </div>
      </div>
    );
  };

  /*
   * STYLED COMPONENTS
   */
  const RadioButton = styled.input.attrs(props => ({
    type: "radio",
    onClick: props.onClick
  }))`
    border-radius: 3px;
    border: 1px solid black;
    display: inline;
    margin: 0 0 1em;
    padding: 5px;
  `;

  const CheckBox = styled.input.attrs(() => ({
    type: "checkbox"
  }))`
    border: 1px solid palevioletred;
    display: inline;
    margin 3px
  `;

  const Button = styled.button.attrs(props => ({
    onClick: props.onClick
  }))`
    display: inline-block;
    border-radius: 3px;
    padding: 3px 8px
    margin-left: auto;
    margin-bottom: 10px
    background: light-grey;
    color: black;
    border: 2px solid black;
  `;

  const VerticalLine = styled.div`
    border-left: 2px solid black;
    height: 500px;
    margin-left: 5px;
    margin-right: 5px;
  `;

  const Row = styled.div`
    display: flex;
  `;

  const Column = styled.div`
    flex: 50%;
  `;

  return numericalProperties.length > 0 ? (
    <div>
      <Row>
        <h3>Aggregations</h3>
        <Button onClick={handleClickDone}>Done</Button>
      </Row>
      <Row>
        <Column>
          {renderRadioButton(
            MethodTypes.Sum,
            handleMethodChange,
            __methodIsSelected
          )}
          {renderRadioButton(
            MethodTypes.Mean,
            handleMethodChange,
            __methodIsSelected
          )}
        </Column>
        <VerticalLine />
        <Column>
          {numericalProperties.map(property => {
            return renderCheckbox(
              property.label,
              handlePropertyChange,
              __propertyIsChecked
            );
          })}
        </Column>
      </Row>
    </div>
  ) : (
    <div />
  );
};

export default AggregationView;
