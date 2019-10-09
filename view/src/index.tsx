import React from "react";
import {useState} from 'react';
import {followBranch} from 'core';
import {BranchSelectorPropsType, BranchType, QueryType} from "core/dist/types";
import BranchSelector from "./components/BranchSelector";
  

const CoordinatorView = (props: BranchSelectorPropsType) => {

  const [query, setQuery] = useState<QueryType>(props.initialQuery);
  if (props.initialQuery !== query) {
    setQuery(props.initialQuery);
  }

  const userWantsToFollowBranch = (branch: BranchType) => {
    followBranch(query, branch)
      .then(newQuery => {
        setQuery(newQuery);
      })
  }


  return (<BranchSelector initialQuery={query} headline={props.headline} followBranch={userWantsToFollowBranch}/>);
};



export default CoordinatorView;
  