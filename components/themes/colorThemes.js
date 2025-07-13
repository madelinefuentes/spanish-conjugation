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
    greyText: "#9ca3af",
  },
  darkMode: false,
};

export const darkTheme = {
  ...spacing,
  ...typography,
  colors: {
    text: "#F2F2F2",
    background: "#18181b",
    greyBackground: "#27272a",
    greyClickable: "#52525b",
    greyDisabled: "#27272a",
    line: "#3f3f46",
    iconColor: "#F2F2F2",
    primary: "#4D8BFF",
    white: "#F2F2F2",
    black: "#212529",
    greyText: "#9ca3af",
  },
  darkMode: true,
};
