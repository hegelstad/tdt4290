import React from "react";
import { ThemeProvider } from "styled-components";
import StartingPoint from "./components/StartingPoint";
import theme from "./styles/theme";

const GremlinView = () => {
  return (
    <ThemeProvider theme={theme}>
      <StartingPoint />
    </ThemeProvider>
  );
};

export default GremlinView;
