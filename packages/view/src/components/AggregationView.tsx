import React, { /*useReducer,*/ useEffect } from "react";
import styled from "styled-components";
import { AggregationViewPropsType } from "../types";
import { MethodTypes, AggregationType } from "core";

const AggregationView = (props: AggregationViewPropsType): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log(event);
    console.log("Properties: ", props.query.properties);
  };

  const renderOption = (methodType: MethodTypes): JSX.Element => {
    return (
      <option value={methodType} key={methodType}>
        {methodType}
      </option>
    );
  };

  //const [aggregations, dispatch] = useReducer(reducer);*/

  useEffect(() => {}, [props.query]);

  /*
  useEffect(() => {
    console.log("Aggregations changed: ", aggregations);
  }, [aggregations]);*/

  /*
   * STYLED COMPONENTS
   */
  const Dropdown = styled.select`
    max-width: 100px;
    display: inline;
    margin: 0 auto;
    border: 1px solid black;
  `;

  const aggregations = { aggregations: [] };
  return (
    <Dropdown onChange={handleChange}>
      {aggregations.aggregations.map((option: AggregationType) => {
        return renderOption(option.method);
      })}
    </Dropdown>
  );
};

export default AggregationView;
