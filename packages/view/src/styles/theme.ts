const grayDark = "#373737";
const gray = "#d6d9e1";
const white = "#fff";
const offWhite = "#f7f8fa";
const purple = "#670867";

const theme = {
  colors: {
    background: white,
    foreground: grayDark,
    gray,
    grayDark,
    highlight: purple,
    offWhite,
    purple,
    white
  },
  fontFamily: "sans-serif",
  roundRadius: "2px",
  spacing: [
    "0px",
    "4px",
    "8px",
    "16px",
    "32px",
    "64px",
    "128px",
    "256px",
    "512px"
  ]
};

export default theme;

type Theme = typeof theme;

/* eslint-disable @typescript-eslint/no-empty-interface */
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */
