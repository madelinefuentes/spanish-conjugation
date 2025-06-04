import { spacing, typography } from "./sizeThemes";

export const lightTheme = {
  ...spacing,
  ...typography,
  colors: {
    text: "#18181b",
    background: "#FFFDFA",
    greyBackground: "#f4f4f5",
    greyClickable: "#e4e4e7",
    line: "#d4d4d8",
    iconColor: "#334155",
    greyDisabled: "#b9bfc8",
    primary: "#4D8BFF",
    white: "#FFFDFA",
    black: "#212529",
  },
  darkMode: false,
};

export const darkTheme = {
  ...spacing,
  ...typography,
  colors: {
    text: "#FFFDFA",
    background: "#18181b",
    greyBackground: "#27272a",
    greyClickable: "#52525b",
    line: "#3f3f46",
    iconColor: "#FFFDFA",
    primary: "#4D8BFF",
    white: "#FFFDFA",
    black: "#212529",
  },
  darkMode: true,
};
