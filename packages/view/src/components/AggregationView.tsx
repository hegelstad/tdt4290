import React, { useState, useEffect } from "react";
import {
  PropertyType,
  PropertyTypes,
  MethodTypes,
  AggregationType
} from "core";
import { AggregationViewPropsType } from "../types";
import CheckBox from "./elements/Checkbox";
import Button from "./elements/Button";
import { Box, FloatRightDiv } from "./elements/Layout";
import Dropdown, { Option } from "./elements/Dropdown";
import { H3, H5 } from "./elements/Text";

const AggregationView = (props: AggregationViewPropsType): JSX.Element => {
  /**
   * HOOKS
   */

  const [numericalProperties, setNumericalProperties] = useState<
    PropertyType[]
  >([]);
  const [selectedMethod, setSelectedMethod] = useState<MethodTypes>(
    MethodTypes.Count
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

  useEffect(() => {
    if (numericalProperties.length > 0) {
      setSelectedMethod(MethodTypes.Sum);
    }
  }, [numericalProperties]);

  /**
   * PRIVATE METHODS
   */

  const propertyIsChecked = (propertyName: string): boolean => {
    return (
      selectedProperties.find(selectedProperty => {
        return selectedProperty.label === propertyName;
      }) !== undefined
    );
  };

  const aggregationIsReady = (): boolean => {
    return (
      selectedProperties.length > 0 || selectedMethod === MethodTypes.Count
    );
  };

  /**
   * HANDLERS
   */

  const handleMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
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
    if (aggregationIsReady()) {
      const aggregation: AggregationType = {
        method: selectedMethod,
        properties: selectedProperties
      };
      props.callback(aggregation);
    }
  };

  /**
   * If we have numerical attributes, show all availiable aggregation methods.
   * If not show only count.
   */

  const methods = Object.values(MethodTypes).filter(method => {
    return numericalProperties.length > 0 || method == "count";
  });

  return props.query && props.query.path && props.query.path.length > 0 ? (
    <Box>
      <FloatRightDiv>
        <H3>Aggregate</H3>
        <Button
          text={"Apply"}
          onClick={handleClickDone}
          floatRight
          disabled={!aggregationIsReady()}
        />
      </FloatRightDiv>
      <div>
        <H5>Calculate the</H5>
        <Dropdown onChange={handleMethodChange} value={selectedMethod}>
          {methods.map(method => {
            return <Option key={method} text={method} />;
          })}
        </Dropdown>
      </div>
      <div>
        {selectedMethod != MethodTypes.Count ? (
          <div>
            <H5>of</H5>
            {numericalProperties.map(property => {
              return (
                <CheckBox
                  key={property.label}
                  unformated-text={property.label}
                  text={property.label}
                  handler={handlePropertyChange}
                  isChecked={propertyIsChecked}
                />
              );
            })}
          </div>
        ) : (
          <div />
        )}
      </div>
    </Box>
  ) : (
    <div />
  );
};

export default AggregationView;
