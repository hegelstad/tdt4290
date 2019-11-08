import React, { useState, useEffect, ReactNode } from "react";
import styled from "styled-components";
import { getSuggestions } from "core";
import { LabelType, EdgeType, BranchType, QueryType } from "core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BranchSelectorPropsType, ButtonPropsType } from "../types";
import { Column, Box } from "./elements/Layout";

const MAX_SUGGESTIONS = 8;

const Button = styled.button.attrs((props: ButtonPropsType) => ({
  onClick: props.onClick
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

const H4 = styled.h4`
  display: inline;
`;

const HorizontalLine = styled.div`
  border-top: ${props => props.theme.border.style};
  width: 250;
  margin-bottom: 30px;
`;

const Headline = styled.h3`
  font-family: Noto Serif;
  font-size: 12;
`;

const ClickableText = ({
  onClick,
  shouldBeVisible,
  children
}: {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  shouldBeVisible: boolean;
  children: ReactNode;
}): JSX.Element | null => {
  const LinkStyledText = styled.p`
    cursor: pointer;
    width: 80px;
    padding: 2px;
    border-radius: ${props => props.theme.roundRadius};
    color: ${props => props.theme.colors.blue};
  `;

  return shouldBeVisible ? (
    <LinkStyledText onClick={onClick}>{children}</LinkStyledText>
  ) : null;
};

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

  const [showMoreLabels, setShowMoreLabels] = useState(false);
  const [showMoreEdges, setShowMoreEdges] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [edgeSuggestions, setEdgeSuggestions] = useState<EdgeType[]>([]);
  const [labelSuggestions, setLabelSuggestions] = useState<LabelType[]>([]);

  /**
   * HOOKS
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

  /**
   * HANDLERS
   */
  const onClickOnLabel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const value = event.currentTarget.textContent;
    const label = labels.find(label => {
      return label.type === "label" && label.value === value;
    }) as LabelType;
    props.followBranch(label);
    setInputValue("");
  };

  const onClickOnEdge = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const valueWithDirection = event.currentTarget.textContent;
    let value = "";
    if (valueWithDirection) {
      value = valueWithDirection.slice(0, valueWithDirection.indexOf("(") - 1);
    }
    const label = edges.find(label => {
      return label.value === value;
    }) as EdgeType;
    props.followBranch(label);
    setInputValue("");
  };

  const renderSuggestion = (suggestion: BranchType): JSX.Element => {
    if (suggestion.type === "label") {
      return (
        <li key={suggestion.value}>
          <Button onClick={onClickOnLabel}>{suggestion.value}</Button>
        </li>
      );
    } else if (suggestion.type === "edge") {
      return (
        <li key={suggestion.value + " (" + suggestion.direction + ")"}>
          <Button onClick={onClickOnEdge}>
            {suggestion.value + " (" + suggestion.direction + ")"}
          </Button>
        </li>
      );
    } else {
      throw new Error("Suggestion not of valid type");
    }
  };

  const onInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  const onClickOnShowMoreLabels = (): void => {
    setShowMoreLabels(!showMoreLabels);
  };

  const onClickOnShowMoreEdges = (): void => {
    setShowMoreEdges(!showMoreEdges);
  };

  const Input = styled.input.attrs(() => ({
    type: "text",
    onInput: onInput,
    defaultValue: inputValue
  }))`
    padding: 2px;
    margin-bottom: 8px;
    margin-left: 10px;
  `;

  if (edges.length > 0 || labels.length > 0) {
    return (
      <Box>
        <Headline>{props.headline}</Headline>
        <HorizontalLine />
        <SearchWrap>
          <FontAwesomeIcon icon={faSearch} />
          <Input placeholder="Start typing..." autoFocus />
        </SearchWrap>
        <br />
        <H4>Components</H4>
        <UnorderedList>
          {showMoreLabels
            ? labelSuggestions.map(renderSuggestion)
            : labelSuggestions.slice(0, MAX_SUGGESTIONS).map(renderSuggestion)}
        </UnorderedList>
        <ClickableText
          onClick={onClickOnShowMoreLabels}
          shouldBeVisible={labelSuggestions.length > MAX_SUGGESTIONS}
        >
          {showMoreLabels ? "Show less" : "Show more"}
        </ClickableText>
        {edgeSuggestions.length > 0 ? (
          <Column>
            <H4>References</H4>
            <UnorderedList>
              {showMoreEdges
                ? edgeSuggestions.map(renderSuggestion)
                : edgeSuggestions
                    .slice(0, MAX_SUGGESTIONS)
                    .map(renderSuggestion)}
            </UnorderedList>
            <ClickableText
              onClick={onClickOnShowMoreEdges}
              shouldBeVisible={edgeSuggestions.length > MAX_SUGGESTIONS}
            >
              {showMoreEdges ? "Show less" : "Show more"}
            </ClickableText>
          </Column>
        ) : null}
      </Box>
    );
  } else {
    return <div />;
  }
};

export default BranchSelector;
