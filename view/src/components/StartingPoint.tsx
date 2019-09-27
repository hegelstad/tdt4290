import React, { useState, useEffect } from "react";
import styled from "styled-components";
import labels from "./labels";

interface Suggestion {
  name: string;
  count: number;
}

const StartingPoint = () => {

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setSuggestions(getSuggestions(value));
  }, [value])

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
    return <li>{suggestion.name}</li>;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };


  return (
    <div>
      <h1>Select starting point</h1>
      <AutosuggestWrap>
        <input onChange={onChange} value={value}/>
          <ul>
            {suggestions.map((suggestion: Suggestion) => {
              return renderSuggestion(suggestion);
            })}
        </ul>
      </AutosuggestWrap>
    </div>
  );
};

const AutosuggestWrap = styled.div`
  .react-autosuggest__container {
    position: relative;
  }

  .react-autosuggest__input {
    width: 240px;
    padding: ${({ theme }) => theme.spacing[2]}
      ${({ theme }) => theme.spacing[3]};
    border: 1px solid ${({ theme }) => theme.colors.gray};
    border-radius: ${({ theme }) => theme.roundRadius};
    -webkit-appearance: none;
  }

  .react-autosuggest__input--focused {
    outline: none;
  }

  .react-autosuggest__input::-ms-clear {
    display: none;
  }

  .react-autosuggest__input--open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .react-autosuggest__suggestions-container {
    display: none;
  }

  .react-autosuggest__suggestions-container--open {
    display: block;
    position: absolute;
    top: calc(100% + ${({ theme }) => theme.spacing[2]});
    width: 240px;
    border: 1px solid ${({ theme }) => theme.colors.gray};
    background-color: ${({ theme }) => theme.colors.white};
    border-bottom-left-radius: ${({ theme }) => theme.roundRadius};
    border-bottom-right-radius: ${({ theme }) => theme.roundRadius};
    z-index: 2;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing[2]}
      ${({ theme }) => theme.spacing[3]};
  }

  .react-autosuggest__suggestion--highlighted {
    background-color: ${({ theme }) => theme.colors.offWhite};
  }

  .react-autosuggest__section-container {
    border-top: 1px dashed ${({ theme }) => theme.colors.offWhite};
  }

  .react-autosuggest__section-container--first {
    border-top: 0;
  }

  .react-autosuggest__section-title {
    padding: ${({ theme }) => theme.spacing[2]} 0 0
      ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.gray};
  }
`;

export default StartingPoint;
