import React from "react";
import { initialize, followBranch, filterQuery, executeQuery } from "core";
import GremlinView from "view";

const config = {
  org: process.env.REACT_APP_ORG,
  token: process.env.REACT_APP_TOKEN,
  apiURL: "/api/graph-search"
};

const App = () => {
  /*
  console.log(config);
  const test_query = async () => {
    console.log("Create base query object:");
    let query = await initialize(config);
    console.log(query);

    console.log("Select all Departments:");
    query = await followBranch(query, { type: "label", value: "Department" });
    console.log(query);

    console.log("Follow all Belongs To relations:");
    query = await followBranch(query, {
      type: "edge",
      value: "Belongs To",
      direction: "in"
    });
    console.log(query);

    console.log("Filter region on the value 'Latin America':");
    query = await filterQuery(query, "region", "Latin America");
    console.log(query);

    console.log("Execute query");
    console.log(await executeQuery(query));
  };
  test_query();*/
  return (
    <div>
      <GremlinView config = {config}/>
    </div>
  );
};

export default App;
