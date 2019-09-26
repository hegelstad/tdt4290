import Autosuggest from "react-autosuggest";
import React, { useState } from "react";
import styled from "styled-components";
import labels from "./labels";

const StartingPoint = () => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : labels.filter(
          label => label.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const getSuggestionValue = suggestion => {
    return suggestion.name;
  };

  const renderSuggestion = suggestion => {
    return <span>{suggestion.name}</span>;
  };

  const onChange = (event, { newValue, method }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: "Application",
    value,
    onChange: onChange
  };

  return (
    <>
      <h1>Select starting point</h1>
      <AutosuggestWrap>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </AutosuggestWrap>
    </>
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
    border: 1px solid ${({ theme }) => theme.colors.grayLight};
    border-radius: ${({ theme }) => theme.defaultRadius};
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
    border: 1px solid ${({ theme }) => theme.colors.grayLight};
    background-color: #fff;
    border-bottom-left-radius: ${({ theme }) => theme.defaultRadius};
    border-bottom-right-radius: ${({ theme }) => theme.defaultRadius};
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
    border-top: 1px dashed ${({ theme }) => theme.colors.grayLight};
  }

  .react-autosuggest__section-container--first {
    border-top: 0;
  }

  .react-autosuggest__section-title {
    padding-top: ${({ theme }) => theme.spacing[2]};
    padding-left: ${({ theme }) => theme.spacing[2]};
    color: #777;
  }
`;

export default StartingPoint;
