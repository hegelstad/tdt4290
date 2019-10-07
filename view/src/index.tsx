import React from "react";
import {useState} from 'react';
import {BranchSelectorPropsType, BranchType, QueryType} from "core/dist/types";
import BranchSelector from "./components/BranchSelector";

const GremlinView = (props: BranchSelectorPropsType) => {

  const [query, setQuery] = useState<QueryType>(props.initialQuery);

  const userWantsToFollowBranch = (branch: BranchType) => {
    
  }

  return (<BranchSelector initialQuery={props.initialQuery} headline={props.headline}/>);
};

export default GremlinView;
