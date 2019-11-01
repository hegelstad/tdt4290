import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  PropertyType,
  PropertyTypes,
  MethodTypes,
  AggregationType
} from "core";
import { AggregationViewPropsType } from "../types";
import CheckBox from "./elements/Checkbox";
import RadioButton from "./elements/RadioButton";
import Button from "./elements/Button";
import { Row, Column } from "./elements/Layout";

/*
 * STYLED COMPONENTS
 */

const VerticalLine = styled.div`
  border-left: 2px solid black;
  height: 500px;
  margin-left: 5px;
  margin-right: 5px;
`;

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

  const methodIsSelected = (methodName: string): boolean => {
    return selectedMethod === methodName;
  };

  const propertyIsChecked = (propertyName: string): boolean => {
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
    switch (value) {
      case MethodTypes.Mean: {
        setSelectedMethod(MethodTypes.Mean);
        break;
      }
      case MethodTypes.Sum: {
        setSelectedMethod(MethodTypes.Sum);
        break;
      }
      case MethodTypes.Count: {
        setSelectedMethod(MethodTypes.Count);
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

    // Find the property that the checkbox was build from
    const property = numericalProperties.find(property => {
      return property.label === value;
    });

    // Find the index in the array of the property found above
    const i = selectedProperties.indexOf(
      property ? property : { label: "", type: PropertyTypes.Undefined },
      0
    );

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
    if (selectedProperties.length > 0 || selectedMethod === MethodTypes.Count) {
      const aggregation: AggregationType = {
        method: selectedMethod,
        properties: selectedProperties
      };
      props.callback(aggregation);
    }
  };

  return numericalProperties.length > 0 ? (
    <div>
      <Row>
        <h3>Aggregations</h3>
        <Button text={"Done"} onClick={handleClickDone} floatRight />
      </Row>
      <Row>
        <Column>
          <RadioButton
            text={MethodTypes.Mean}
            handler={handleMethodChange}
            isSelected={methodIsSelected}
          />
          <RadioButton
            text={MethodTypes.Sum}
            handler={handleMethodChange}
            isSelected={methodIsSelected}
          />
          <RadioButton
            text={MethodTypes.Count}
            handler={handleMethodChange}
            isSelected={methodIsSelected}
          />
        </Column>
        <VerticalLine />
        <Column>
          {selectedMethod != MethodTypes.Count ? (
            numericalProperties.map(property => {
              return (
                <CheckBox
                  key={property.label}
                  text={property.label}
                  handler={handlePropertyChange}
                  isChecked={propertyIsChecked}
                />
              );
            })
          ) : (
            <div />
          )}
        </Column>
      </Row>
    </div>
  ) : (
    <div />
  );
};

export default AggregationView;
