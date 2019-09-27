import React from "react";
import StartingPoint from "./components/StartingPoint";
import { ThemeProvider } from "styled-components";
import theme from "./styles/theme";

const GremlinView = () => {
  return (
    <ThemeProvider theme={theme}>
      <StartingPoint />
    </ThemeProvider>
  );
};

export default GremlinView;
