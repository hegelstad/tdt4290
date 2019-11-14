import React, { useState, useEffect, ReactNode } from "react";
import styled from "styled-components";
import { getSuggestions } from "core";
import { LabelType, EdgeType, BranchType, QueryType } from "core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlusCircle,
  faMinusCircle
} from "@fortawesome/free-solid-svg-icons";
import { BranchSelectorPropsType } from "../types";
import { Box, HorizontalLine } from "./elements/Layout";
import { ListItemButton } from "./elements/Button";
import { H3, H4, H5 } from "./elements/Text";
import Dropdown from "./elements/Dropdown";
import Input from "./elements/Input";

const MAX_SUGGESTIONS = 10;

const UnorderedList = styled.ul`
  list-style: none;
  display: inline;
`;

const ClickTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LinkStyledText = styled.p`
  cursor: pointer;
  padding: 2px;
  border-radius: ${props => props.theme.roundRadius};
  color: #3e4753;
  margin-left: 5px;
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
  const [notValue, setNot] = useState(false);
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
    setNot(false);
  }, [inputValue, props.query]);

  /**
   * HANDLERS
   */
  const handleClickOnLabel = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const value = event.currentTarget.textContent;
    const label = labels.find(label => {
      return label.type === "label" && label.value === value;
    }) as LabelType;
    props.followBranch(label);
    label.notValue = notValue;
    setInputValue("");
  };

  const handleClickOnEdge = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
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

  const renderSuggestion = (suggestion: BranchType): JSX.Element => {
    if (suggestion.type === "label") {
      return (
        <ListItemButton
          key={suggestion.value}
          text={suggestion.value}
          onClick={handleClickOnLabel}
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
          onClick={handleClickOnEdge}
        />
      );
    } else {
      throw new Error("Suggestion not of valid type");
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputValue(event.target.value);
  };

  const handleClickOnShowMoreLabels = (): void => {
    setShowMoreLabels(!showMoreLabels);
  };

  const handleClickOnShowMoreEdges = (): void => {
    setShowMoreEdges(!showMoreEdges);
  };

  // Styled Components

  if (edges.length > 0 || labels.length > 0) {
    return (
      <Box>
        <H3>{props.headline}</H3>
        <HorizontalLine />
        <div>
          <FontAwesomeIcon icon={faSearch} />
          <Input
            placeholder="Start typing..."
            autoFocus
            onChange={handleInputChange}
            value={inputValue}
          />
        </div>
        <H4>COMPONENTS</H4>
        <Dropdown onChange={handleDropDownChange} value={String(notValue)}>
          <option value="false">Select</option>
          <option value="true">Select everything that is not</option>
        </Dropdown>
        <UnorderedList>
          {showMoreLabels
            ? labelSuggestions.map(renderSuggestion)
            : labelSuggestions.slice(0, MAX_SUGGESTIONS).map(renderSuggestion)}
        </UnorderedList>
        {labelSuggestions.length > MAX_SUGGESTIONS ? (
          <ClickTextWrap>
            {showMoreLabels ? (
              <FontAwesomeIcon icon={faMinusCircle} />
            ) : (
              <FontAwesomeIcon icon={faPlusCircle} />
            )}
            <ClickableText
              onClick={handleClickOnShowMoreLabels}
              shouldBeVisible={labelSuggestions.length > MAX_SUGGESTIONS}
            >
              {showMoreLabels ? "SHOW LESS" : "SHOW MORE"}
            </ClickableText>
          </ClickTextWrap>
        ) : null}
        {edgeSuggestions.length > 0 &&
        props.query &&
        props.query.path &&
        props.query.path.length > 0 ? (
          <>
            <H4>REFERENCES</H4>
            <H5>
              {currentBranch && currentBranch.type === "label"
                ? "Select components that:"
                : "Follow reference"}
            </H5>
            <UnorderedList>
              {showMoreEdges
                ? edgeSuggestions.map(renderSuggestion)
                : edgeSuggestions
                    .slice(0, MAX_SUGGESTIONS)
                    .map(renderSuggestion)}
            </UnorderedList>
            {edgeSuggestions.length > MAX_SUGGESTIONS ? (
              <ClickTextWrap>
                {showMoreEdges ? (
                  <FontAwesomeIcon icon={faMinusCircle} />
                ) : (
                  <FontAwesomeIcon icon={faPlusCircle} />
                )}
                <ClickableText
                  onClick={handleClickOnShowMoreEdges}
                  shouldBeVisible={edgeSuggestions.length > MAX_SUGGESTIONS}
                >
                  {showMoreEdges ? "SHOW LESS" : "SHOW MORE"}
                </ClickableText>
              </ClickTextWrap>
            ) : null}
          </>
        ) : null}
      </Box>
    );
  } else {
    return <div />;
  }
};

export default BranchSelector;
