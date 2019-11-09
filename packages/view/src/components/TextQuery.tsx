import React, { useState, useEffect } from "react";
import { stringifyPath } from "core";
import { TextQueryType } from "../types";
import Button from "./elements/Button";
import { Box, Row } from "./elements/Layout";
import styled from "styled-components";

const TextQueryWrap = styled.div`
        margin: 0 auto;
        
        padding: 20px;
        display: flex
        flex-direction: column;
        text-align: center
        overflow: auto
    `;

//This component shows the Gremlin query in text, and gives the option to copy it to the clipboard.
const TextQuery = (props: TextQueryType): JSX.Element => {
  const [query, setQuery] = useState("");

  //Listens to the query coming from props, updates visualisation of text query when it changes.
  useEffect(() => {
    props.query.path &&
      setQuery(stringifyPath(props.query.path, props.query.aggregation));
  }, [props.query]);

  //Copy current query to clipboard
  const onCopyClipBoardButtonClick = () => {
    navigator.clipboard &&
      navigator.clipboard.writeText(query).then(
        () => {
          console.log("Copied.");
        },
        () => {
          console.log("Error copying.");
        }
      );
  };

  //Used to send the query to another component suitable for editing it.
  const onEditButtonClick = () => {
    props.editFunction(query);
  };

  return (
    <Box>
      <TextQueryWrap>
        <p>{query}</p>
      </TextQueryWrap>
      <Row>
        <Button
          text={"Copy to clipboard"}
          onClick={onCopyClipBoardButtonClick}
        />
        <Button text={"Edit query"} onClick={onEditButtonClick} />
      </Row>
    </Box>
  );
};

export default TextQuery;
