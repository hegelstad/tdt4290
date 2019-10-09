import React from "react";
import {useState} from 'react';
import {followBranch} from 'core';
import {BranchType, QueryType} from "core/dist/types";
import BranchSelector from "./components/BranchSelector";
import { BranchSelectorPropsType } from "./types/types";
  

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


  return (<BranchSelector initialQuery={query} headline={"Where would you like to start?"} followBranch={userWantsToFollowBranch}/>);
};



export default CoordinatorView;
  