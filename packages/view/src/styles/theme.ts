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
      primaryText: "#ffffff",
      primaryBackground: "#1574ff",
      primaryHover: "#1130bb",
      secondaryText: "#3E4753",
      secondaryBackground: "#EEF1F3",
      secondaryHover: "#CCD0D1"
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
    h1: "30px",
    h2: "25px",
    h3: "22px",
    h4: "18px",
    h5: "15px",
    button: "15px"
  },
  roundRadius: {
    box: "5px",
    button: "2px"
  },
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
