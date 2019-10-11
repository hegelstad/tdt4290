import React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { followBranch } from "core";
import {
  BranchType,
  QueryType
} from "core/dist/types";
import BranchSelector from "./components/BranchSelector";
import TextQuery from "./components/TextQuery";
import theme from "./styles/theme";
import { BranchSelectorPropsType } from "./types/types";

const CoordinatorView = (props: BranchSelectorPropsType) => {
  const [query, setQuery] = useState<QueryType>(props.initialQuery);
  const branchSelectorHeadline = query.path && query.path.length > 0 
                              ? query.path[query.path.length - 1].value as string
                              : "Where would you like to start?";


  console.log("Query on enter of CoordinatorView:", query);
  if (!query.branches && props.initialQuery.branches) {
    setQuery(props.initialQuery);
  }

  const userWantsToFollowBranch = (branch: BranchType) => {
    followBranch(query, branch).then(newQuery => {
      setQuery(newQuery);
    });
  };

  return (

    <div>
      <ThemeProvider theme={theme}>
        <BranchSelector
          initialQuery={query}
          headline={props.headline}
          followBranch={userWantsToFollowBranch}
        />
      </ThemeProvider>

      <ThemeProvider theme = {theme}>
        <TextQuery query = {query}/>
      </ThemeProvider>
    </div>
  );
};

export default CoordinatorView;
