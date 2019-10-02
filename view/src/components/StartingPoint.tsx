import React, { useState, useEffect } from "react";
import styled from "styled-components";
import labels from "./labels";
import {ConfigType, QueryType} from "core/src/types";
import {callAPI} from "core/src/utils";

const initialize = async (config: ConfigType): Promise<QueryType> => {
  const response: { result: string[] } = await callAPI(config, {
    query: "g.V().groupCount().by(label).unfold().order().by(values, decr).project(‘name’,‘count’).by(keys).by(values)"
  });
  return {
    path: [],
    branches: response.result.map(label => ({ type: "label", value: label})),
    properties: [],
    aggregation: undefined,
    config
  };
};

const StartingPoint = (props: StartingPointProps) => {

  const {config} = props;
  console.log("props: " + JSON.stringify(props.config));
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [query, setQuery] = useState({});

  useEffect(() => {
    setSuggestions(getSuggestions(value));
  }, [value]);

  useEffect( () => {
    const test = async () => {
      setQuery(await initialize(config));
    };
    test();
  }, [config]);

  useEffect(() => {
    console.log(query)
  }, [query]);

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : labels.filter(
          label => label.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const renderSuggestion = (suggestion: Suggestion) => {
    return (
      <li>
        <Button>{suggestion.name}</Button>
      </li>
    )
  };

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  
  // Styled Components
  const Input = styled.input.attrs(() => ({
    type: 'text',
    onInput: onInput,
    defaultValue: value
    }))`
    padding: 2px
    `

  const Button = styled.button`
    border-radius: 15px;
  `;

  const AutosuggestWrap = styled.div`
    width: 400px
    padding: 10px;
    border: 1px solid black;
    display: block
  `;

  /*const UnorderedList = styled.ul`
    
  `;*/


  return (
      <AutosuggestWrap>
        <div>
          <h1>Where would you like to start?</h1>
            <Input placeholder="Application" autoFocus/>
            <ul>
              {suggestions.map(renderSuggestion)}
            </ul>
        </div>
      </AutosuggestWrap>
  );
};



export default StartingPoint;
