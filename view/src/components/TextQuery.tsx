import React, { useState, } from "react";
import styled from "styled-components";
import {stringifyPath} from "core";



const TextQuery = (props: any) => {



    const [query, setQuery] = useState("");
    const [showQuery, setShowQuery] = useState(false);
    

    //Show current query
    const OnShowButtonClick = () => {
        setShowQuery(!showQuery);
        setQuery(stringifyPath(props.query.path, props.query.aggregation));
    }

    //Copy current query to clipboard
    const OnCopyButtonClick = () => {
        navigator.clipboard.writeText(query);
    }


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





    return showQuery
      ? (
        <TextQueryWrap>
            <div>
                <ShowQueryButton>Hide Gremlin query</ShowQueryButton>
            </div>
            <div>
                <p>
                    {query}
                </p>
                
            </div>
            <div>
                <CopyToClipBoardButton>Copy to clipboard</CopyToClipBoardButton>
            </div>
            
        </TextQueryWrap>
      )
      : <TextQueryWrap>
            <div>
                <ShowQueryButton>Show Gremlin query</ShowQueryButton>
            </div>
            
        </TextQueryWrap>;


};


export default TextQuery;
