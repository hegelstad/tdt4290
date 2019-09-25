import Autosuggest from 'react-autosuggest';
import React, {useState} from 'react';
import labels from './labels';


const StartingPoint = () => {

    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : labels.filter(label => label.name.toLowerCase().slice(0, inputLength) === inputValue);
    }

    const getSuggestionValue = (suggestion) => {
        return suggestion.name;
    }
    
    const renderSuggestion = (suggestion) => {
        return (
            <span>{suggestion.name}</span>
        );
    }


    const onChange = (event, {newValue, method}) => {
        setValue(newValue);
    }

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    }

    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    }

    const inputProps = {
        placeholder: 'Application',
        value,
        onChange: onChange
    };

    return (
        <div>
            <h1>Select starting point</h1>
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        </div>
    )
}

export default StartingPoint;

