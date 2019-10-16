import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { stringifyPath } from "core";
import { TextQueryType } from "../types/types";

//This component shows the Gremlin query in text, and gives the option to copy it to the clipboard.
const TextQuery = (props: TextQueryType) => {
  const [query, setQuery] = useState("");
  const [showQuery, setShowQuery] = useState(false);

  //Listens to the query coming from props, updates visualisation of text query when it changes.
  useEffect(() => {
    if (props.query.path !== undefined) {
      setQuery(stringifyPath(props.query.path, props.query.aggregation));
    }
  }, [props.query]);

  //Show/hide current query
  const OnShowButtonClick = (): void => {
    setShowQuery(!showQuery);
    setQuery(stringifyPath(props.query.path, props.query.aggregation));
  };

  //Copy current query to clipboard
  const OnCopyButtonClick = (): void => {
    navigator.clipboard.writeText(query);
  };

  //Styled components
  const ShowQueryButton = styled.button.attrs(() => ({
    onClick: OnShowButtonClick
  }))`
    font-size: 0.8em;
    margin: 0.8em;
    padding: 0.25em 1em;
    border: 2px solid;
    border-radius: 3px;
  `;

  const CopyToClipBoardButton = styled.button.attrs(() => ({
    onClick: OnCopyButtonClick
  }))`
    font-size: 0.8em;
    margin: 0.8em;
    padding: 0.25em 1em;
    border: 2px solid;
    border-radius: 3px;
  `;

  const TextQueryWrap = styled.div`
        max-width: 400px;
        margin: 0 auto;
        
        padding: 20px;
        display: flex
        flex-direction: column;
        text-align: center
    `;

  return showQuery ? (
    <TextQueryWrap>
      <div>
        <ShowQueryButton>Hide Gremlin query</ShowQueryButton>
      </div>
      <div>
        <p>{query}</p>
      </div>
      <div>
        <CopyToClipBoardButton>Copy to clipboard</CopyToClipBoardButton>
      </div>
    </TextQueryWrap>
  ) : (
    <TextQueryWrap>
      <div>
        <ShowQueryButton>Show Gremlin query</ShowQueryButton>
      </div>
    </TextQueryWrap>
  );
};

export default TextQuery;
