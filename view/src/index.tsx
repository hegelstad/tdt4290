import React from "react";
import StartingPoint from "./components/StartingPoint";
import { ThemeProvider } from "styled-components";
import theme from "./styles/theme";

const GremlinView = (props: StartingPointProps) => {
  return (
    <ThemeProvider theme={theme}>
      <StartingPoint config = {props.config}/>
    </ThemeProvider>
  );
};

export default GremlinView;
