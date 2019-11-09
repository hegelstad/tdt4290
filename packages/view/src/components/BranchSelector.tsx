import React, { useState, useEffect, ReactNode } from "react";
import styled from "styled-components";
import { getSuggestions } from "core";
import { LabelType, EdgeType, BranchType, QueryType } from "core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BranchSelectorPropsType } from "../types";
import { Box, HorizontalLine } from "./elements/Layout";
import { ListItemButton } from "./elements/Button";
import { H3 } from "./elements/Text";

const MAX_SUGGESTIONS = 10;

/*
const SearchWrap = styled.div`
  display: inline;
`;
*/

const UnorderedList = styled.ul`
  list-style: none;
  display: inline;
`;

const H4 = styled.h4`
  display: inline;
  margin-bottom: 10px;
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

  const currentBranch =
    props.query && props.query.path
      ? props.query.path[props.query.path.length - 1]
      : undefined;

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
      if (valueWithDirection.indexOf("[") > 0) {
        value = valueWithDirection.slice(
          0,
          valueWithDirection.indexOf("[") - 1
        );
      } else {
        value = valueWithDirection.slice(valueWithDirection.indexOf("]") + 2);
      }
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
        <ListItemButton
          key={suggestion.value}
          text={suggestion.value}
          onClick={onClickOnLabel}
        />
      );
    } else if (suggestion.type === "edge") {
      let edgeText = suggestion.value;
      if (currentBranch && currentBranch.type !== "edge") {
        switch (suggestion.direction) {
          case "in":
            edgeText = edgeText + " [" + currentBranch.value + "]";
            break;
          case "out":
            edgeText = "[" + currentBranch.value + "] " + edgeText;
            break;
        }
      } else if (currentBranch) {
        switch (suggestion.direction) {
          case "in":
            edgeText = edgeText + " [incoming]";
            break;
          case "out":
            edgeText = "[outgoing] " + edgeText;
            break;
        }
      }
      return (
        <ListItemButton
          key={edgeText}
          text={edgeText}
          onClick={onClickOnEdge}
        />
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
        <H3>{props.headline}</H3>
        <HorizontalLine />
        <div>
          <FontAwesomeIcon icon={faSearch} />
          <Input placeholder="Start typing..." autoFocus />
        </div>
        <br />
        <H4> Select all connected components of type</H4>
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
          <>
            <H4>
              {currentBranch && currentBranch.type === "label"
                ? "Select components that:"
                : "Follow reference"}
            </H4>
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
          </>
        ) : null}
      </Box>
    );
  } else {
    return <div />;
  }
};

export default BranchSelector;
