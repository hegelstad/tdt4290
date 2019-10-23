import React, { /*useReducer,*/ useEffect } from "react";
import styled from "styled-components";
import {
  AggregationReducerState,
  AggregationReducerAction
} from "../types/types";

const AggregationView = (props: any) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log(event);
    console.log("Properties: ", props.query.properties);
  };

  const renderOption = (methodType: any) => {
    return (
      <option value={methodType} key={methodType}>
        {methodType}
      </option>
    );
  };

  const reducer = (
    state: AggregationReducerState,
    action: AggregationReducerAction
  ) => {
    console.log(state);
    console.log(action);
  };

  console.log(reducer);

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
      {aggregations.aggregations.map((option: any) => {
        return renderOption(option.method);
      })}
    </Dropdown>
  );
};

export default AggregationView;
