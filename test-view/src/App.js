import React from "react";

import GremlinView from "view";
import { initialize, followBranch, executeQuery } from "core";

const config = {
  org: process.env.REACT_APP_ORG,
  token: process.env.REACT_APP_TOKEN,
  apiURL: "/api/graph-search"
};

const App = () => {
  console.log(config);
  const test_query = async () => {
    console.log("Create base query object:");
    let query = await initialize(config);
    console.log(query);

    console.log("Select all Departments:");
    query = await followBranch(query, { type: "label", value: "Department" });
    console.log(query);

    console.log("Follow all Belongs To relations:");
    query = await followBranch(query, { type: "edge", value: "Belongs To" });
    console.log(query);

    console.log("Execute query");
    console.log(await executeQuery(query));
  };
  test_query();
  return (
    <div>
      <GremlinView />
    </div>
  );
};

export default App;
