import { spacing, typography } from "./sizeThemes";

export const lightTheme = {
  ...spacing,
  ...typography,
  colors: {
    background: "#FFFDFA",
    line: "#dee2e6",
    text: "#212529",
    iconColor: "#334155",
    greyBackground: "#e8e9ed",
    greyClickable: "#9ca3af",
    greyDisabled: "#b9bfc8",
    buttonOutline: "#d1d5db",
    primary: "#4D8BFF",
    white: "#FFFDFA",
    black: "#212529",
    danger: "#ef4444",
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
    buttonOutline: "#d1d5db",
    primary: "#4D8BFF",
    white: "#FFFDFA",
    black: "#212529",
    danger: "#f87171",
  },
  darkMode: true,
};
