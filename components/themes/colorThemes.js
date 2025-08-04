import { spacing, typography } from "./sizeThemes";

export const lightTheme = {
  ...spacing,
  ...typography,
  colors: {
    text: "#18181b",
    background: "#FFFDFA",
    modalBackground: "#FFFDFA",
    greyBackground: "#f4f4f5",
    greyClickable: "#d4d4d8",
    line: "#d4d4d8",
    iconColor: "#334155",
    greyDisabled: "#e4e4e7",
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
    modalBackground: "#212121",
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
