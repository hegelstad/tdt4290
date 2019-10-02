import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllLabels } from "core";
import {SortableLabelType} from "core/dist/types";


const StartingPoint = (props: StartingPointProps) => {

  const {config} = props;
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<SortableLabelType[]>([]);
  const [labels, setLabels] = useState<SortableLabelType[]>([]);

  useEffect(() => {
    setSuggestions(getSuggestions(value));
  }, [value]);

  useEffect( () => {
    getAllLabels(config)
      .then(result => {
        setLabels(result);
      })
  }, [config]);

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : labels.filter(
          label => label.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const renderSuggestion = (suggestion: SortableLabelType) => {
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
