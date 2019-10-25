import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PropertyType, PropertyTypes, MethodTypes } from "core";
import { AggregationViewPropsType } from "../types";

const AggregationView = (props: AggregationViewPropsType) => {
  const [numericalProperties, setNumericalProperties] = useState<
    PropertyType[]
  >([]);
  const [selectedMethod, setSelectedMethod] = useState<MethodTypes>(
    MethodTypes.Mean
  );

  const handleRadioButtonSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    console.log("Event: ", event);
    console.log("Checkbox value: ", value);
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

  const handleCheckboxSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    console.log(event);
  };

  const renderRadioButton = (text: string) => {
    return (
      <div>
        <RadioButton
          onChange={handleRadioButtonSelect}
          value={text}
          key={text}
          checked={selectedMethod === text}
        />
        {" " + text}
        <br />
      </div>
    );
  };

  const renderCheckbox = (text: string) => {
    return (
      <div key={text}>
        <Checkbox onChange={handleCheckboxSelect} value={text} />
        {" " + text}
        <br />
      </div>
    );
  };

  useEffect(() => {
    if (props.query.properties) {
      setNumericalProperties(
        props.query.properties.filter(property => {
          return property.type === PropertyTypes.Number;
        })
      );
    }
  }, [props.query]);

  /*
   * STYLED COMPONENTS
   */
  const RadioButton = styled.input.attrs(() => ({
    type: "radio"
  }))`
    border-radius: 3px;
    border: 1px solid palevioletred;
    display: inline;
    margin: 0 0 1em;
    padding: 5px;
  `;

  const Checkbox = styled.input.attrs(() => ({
    type: "checkbox"
  }))`
    border: 1px solid palevioletred;
    display: inline;
    margin 3px
  `;

  const Row = styled.div`
    display: flex;
  `;

  const Column = styled.div`
    flex: 50%;
  `;

  return (
    <Row>
      <Column>
        {renderRadioButton(MethodTypes.Sum)}
        {renderRadioButton(MethodTypes.Mean)}
      </Column>
      <Column>
        {numericalProperties.map(property => {
          return renderCheckbox(property.label);
        })}
      </Column>
    </Row>
  );
};

export default AggregationView;
