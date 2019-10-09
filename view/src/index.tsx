import React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { followBranch } from "core";
import {
  BranchSelectorPropsType,
  BranchType,
  QueryType
} from "core/dist/types";
import BranchSelector from "./components/BranchSelector";
import TextQuery from "./components/TextQuery";
import theme from "./styles/theme";

const CoordinatorView = (props: BranchSelectorPropsType) => {
  const [query, setQuery] = useState<QueryType>(props.initialQuery);
  if (props.initialQuery !== query) {
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
