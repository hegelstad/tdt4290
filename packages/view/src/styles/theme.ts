const grayDark = "#373737";
const gray = "#d6d9e1";
const white = "#fff";
const offWhite = "#f7f8fa";
const purple = "#670867";
const black = "#000000";
const blue = "#4682B4";

const theme = {
  colors: {
    checkbox: {
      border: black
    },
    button: {
      textColor: "#white",
      background: "#1574ff",
      backgroundHover: "#1130bb"
    },
    box: {
      background: "#3E4753"
    },
    radiobutton: {},
    background: white,
    foreground: grayDark,
    gray,
    grayDark,
    highlight: purple,
    offWhite,
    purple,
    white,
    blue
  },
  box: {
    border: "1px solid black",
    display: "block",
    borderRadius: "10px",
    padding: "10px",
    margin: "30px",
    width: "350px",
    historyHeight: "220px"
  },
  border: {
    style: "1px solid black"
  },
  fontFamily: "Noto Serif",
  fontSize: {
    h1: 20,
    h2: 15,
    h3: 12,
    h4: 9,
    h5: 7
  },
  roundRadius: "5px",
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
