import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getSuggestions } from "core";
import { LabelType, EdgeType, BranchType, QueryType } from "core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BranchSelectorPropsType } from "../types";

const BranchSelector = (props: BranchSelectorPropsType): JSX.Element => {
  const getBranchTypeFrom = (
    type: string,
    initialQuery: QueryType
  ): BranchType[] => {
    return initialQuery.branches
      ? initialQuery.branches.filter(branch => {
          return branch.type === type;
        })
      : [];
  };
  const labels = getBranchTypeFrom("label", props.query);
  const edges = getBranchTypeFrom("edge", props.query);

  const [inputValue, setInputValue] = useState("");
  const [notValue, setNot] = useState(false);
  const [edgeSuggestions, setEdgeSuggestions] = useState<EdgeType[]>([]);
  const [labelSuggestions, setLabelSuggestions] = useState<LabelType[]>([]);

  /**
   * When inputValue changes, recalculate suggestions.
   */
  useEffect(() => {
    const labelSuggestions = (getSuggestions(
      inputValue,
      labels
    ) as unknown) as LabelType[];
    const edgeSuggestions = (getSuggestions(
      inputValue,
      edges
    ) as unknown) as EdgeType[];

    setLabelSuggestions(labelSuggestions);
    setEdgeSuggestions(edgeSuggestions);
  }, [inputValue, props.query]);

  const renderSuggestion = (suggestion: BranchType): JSX.Element => {
    if (suggestion.type === "label") {
      return (
        <li key={suggestion.value}>
          <LabelButton>{suggestion.value}</LabelButton>
        </li>
      );
    } else if (suggestion.type === "edge") {
      return (
        <li key={suggestion.value + " (" + suggestion.direction + ")"}>
          <EdgeButton>
            {suggestion.value + " (" + suggestion.direction + ")"}
          </EdgeButton>
        </li>
      );
    } else {
      throw new Error("Suggestion not of valid type");
    }
  };

  const onInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  const onClickOnLabel = (
    event: React.ChangeEvent<HTMLButtonElement>
  ): void => {
    const value = event.target.firstChild
      ? event.target.firstChild.textContent
      : "";
    const label = labels.find(label => {
      return label.type === "label" && label.value === value;
    }) as LabelType;
    label.notValue = notValue;
    props.followBranch(label);
    setInputValue("");
  };

  /**
   * These two functions can probably be merged together.
   */
  const onClickOnEdge = (event: React.ChangeEvent<HTMLButtonElement>): void => {
    const valueWithDirection = event.target.firstChild
      ? (event.target.firstChild.textContent as string)
      : "";
    const value = valueWithDirection.slice(
      0,
      valueWithDirection.indexOf("(") - 1
    );
    const label = edges.find(label => {
      return label.value === value;
    }) as EdgeType;
    label.notValue = notValue;
    props.followBranch(label);
    setInputValue("");
  };

  const handleDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value === "false") {
      setNot(false);
    } else if (event.target.value === "true") {
      setNot(true);
    }
  };

  // Styled Components
  const Input = styled.input.attrs(() => ({
    type: "text",
    onInput: onInput,
    defaultValue: inputValue
  }))`
    padding: 2px;
    margin-bottom: 8px;
    margin-left: 10px;
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
    display: inline;
  `;

  const UnorderedList = styled.ul`
    list-style: none;
    display: inline;
  `;

  const BranchSelectorWrap = styled.div`
    display: block;
  `;

  const Loading = styled.h2`
    display: inline;
  `;

  const H3 = styled.h3`
    display: inline;
  `;

  const NotWrap = styled.div`
    border: 1px solid black;
    padding 5px;
  `;

  const FieldSelect = styled.select.attrs(() => ({
    onChange: handleDropDownChange,
    value: notValue
  }))`
    padding: 2px;
    width: 200px;
  `;

  return edges.length > 0 || labels.length > 0 ? (
    <BranchSelectorWrap>
      <h1>{props.headline}</h1>
      <SearchWrap>
        <FontAwesomeIcon icon={faSearch} />
        <Input placeholder="Start typing..." autoFocus />
      </SearchWrap>
      <br />
      <NotWrap>
        <p>When you select components or references</p>
        <FieldSelect>
          <option value="false">choose selected</option>
          <option value="true">choose all other than selected</option>
        </FieldSelect>
      </NotWrap>
      <br />
      <H3>Components</H3>
      <UnorderedList>{labelSuggestions.map(renderSuggestion)}</UnorderedList>
      {edgeSuggestions.length > 0 ? <H3>References</H3> : null}
      <UnorderedList>{edgeSuggestions.map(renderSuggestion)}</UnorderedList>
    </BranchSelectorWrap>
  ) : (
    <Loading>Loading...</Loading>
  );
};

export default BranchSelector;
