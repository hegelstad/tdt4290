import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {getSuggestions, followBranch} from "core";
import { LabelType, BranchSelectorPropsType, EdgeType, BranchType, QueryType} from "core/dist/types";
import  { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from '@fortawesome/free-solid-svg-icons'


const BranchSelector = (props: BranchSelectorPropsType) => {

  const getBranchTypeFrom = (type: string, initialQuery: QueryType) => {
    return initialQuery.branches ? initialQuery.branches.filter(branch => { return branch.type === type}) : [];
  }

  const labels = getBranchTypeFrom("label", props.initialQuery);
  const edges = getBranchTypeFrom("edge", props.initialQuery);

  const [inputValue, setInputValue] = useState("");
  const [edgeSuggestions, setEdgeSuggestions] = useState<EdgeType[]>([]);
  const [labelSuggestions, setLabelSuggestions] = useState<LabelType[]>([]);


  /**
   * When inputValue changes, recalculate suggestions. 
   */
  useEffect(() => {
    const labelSuggestions = getSuggestions(inputValue, labels) as unknown as LabelType[];
    const edgeSuggestions = getSuggestions(inputValue, edges) as unknown as EdgeType[];

    setLabelSuggestions(labelSuggestions);
    setEdgeSuggestions(edgeSuggestions);

    console.log("Called");
  }, [inputValue, labels, edges]);


  const renderSuggestion = (suggestion: BranchType) => {
    if (suggestion.type === "label") {
      return (
        <li key={suggestion.value}>
          <LabelButton>{suggestion.value}</LabelButton>
        </li>
      );
    } else if (suggestion.type === "edge") {
      return (
        <li key={suggestion.value}>
          <EdgeButton>{suggestion.value}</EdgeButton>
        </li>
      );
    } else {
      return "Error: Suggestion not of valid type"
    }

  };

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onClickOnLabel = (event: React.ChangeEvent<HTMLButtonElement>) => {
    const value = event.target.firstChild as unknown as string;
    const label = labels.find(label => { label.type === "label" && label.value === value}) as LabelType;
    followBranch(props.initialQuery, label);

  }

  /**
   * These two functions can probably be merged together. 
   * @param event 
   */
  const onClickOnEdge = (event: React.ChangeEvent<HTMLButtonElement>) => {
    const value = event.target.firstChild as unknown as string;
    const label = edges.find(label => {label.value === value}) as EdgeType;
    followBranch(props.initialQuery, label);
  }

  
  // Styled Components
  const Input = styled.input.attrs(() => ({
    type: 'text',
    onInput: onInput,
    defaultValue: inputValue
    }))`
    padding: 2px
    margin-bottom: 8px
    margin-left: 10px
  `;

  const LabelButton = styled.button.attrs(() => ({
    onClick: onClickOnLabel
    }))`
    border-radius: 5px;
    background-color: light-grey;
  `;

  const EdgeButton = styled.button.attrs(() => ({
    onClick: onClickOnEdge
    }))`
    border-radius: 5px;
    background-color: light-grey;
  `;

  const SearchWrap = styled.div`
    display: inline
  `;

  const UnorderedList = styled.ul`
    list-style: none;
    display: inline;
  `;

  const BranchSelectorWrap = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding-left: 10px;
    border: 1px solid black;
    display: block
  `;

  const Loading = styled.h2`
    display: inline
  `;


  return edges.length > 0 || labels.length > 0 
      ? (
      <BranchSelectorWrap>
        <h1>{props.headline}</h1>
        <SearchWrap>
          <FontAwesomeIcon icon={faSearch}/>
          <Input placeholder="Start typing..." autoFocus/>
        </SearchWrap>
        <UnorderedList>
          {labelSuggestions.map(renderSuggestion)}
        </UnorderedList>
        {edgeSuggestions.length > 0 ? <h3>Relationships</h3> : null}
        <UnorderedList>
          {edgeSuggestions.map(renderSuggestion)}
        </UnorderedList>
      </BranchSelectorWrap>
      )
      : <Loading>Loading...</Loading>;
};



export default BranchSelector;
