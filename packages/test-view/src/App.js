import React, { useState, useEffect } from "react";
import { initialize } from "core";
import CoordinatorView from "view";

const config = {
  org: process.env.REACT_APP_ORG,
  token: process.env.REACT_APP_TOKEN,
  apiURL: "/api/graph-search"
};

const App = () => {
  const [initialQuery, setInitialQuery] = useState();

  /**
   * Initialize the query the first time.
   */
  useEffect(() => {
    initialize(config).then(initialQuery => {
      setInitialQuery(initialQuery);
    });
  }, []);

  return (
    <div>
      {initialQuery ? <CoordinatorView query={initialQuery} /> : "Loading"}
    </div>
  );
};

export default App;
