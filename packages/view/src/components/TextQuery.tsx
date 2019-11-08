import React, { useState, useEffect } from "react";
import { stringifyPath } from "core";
import { TextQueryType } from "../types";
import Button from "./elements/Button";
import { Box, Row } from "./elements/Layout";

//This component shows the Gremlin query in text, and gives the option to copy it to the clipboard.
const TextQuery = (props: TextQueryType): JSX.Element => {
  const [query, setQuery] = useState("");

  //Listens to the query coming from props, updates visualisation of text query when it changes.
  useEffect(() => {
    console.log("Query changed");
    props.query.path &&
      setQuery(stringifyPath(props.query.path, props.query.aggregation));
  }, [props.query]);

  //Copy current query to clipboard
  const onCopyClipBoardButtonClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(query).then(
        () => {
          console.log("Copied.");
        },
        () => {
          console.log("Error copying.");
        }
      );
    }
  };

  //Used to send the query to another component suitable for editing it.
  const onEditButtonClick = () => {
    props.editFunction(query);
  };

  return (
    <Box>
      <Row>
        <p>{query}</p>
      </Row>
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
