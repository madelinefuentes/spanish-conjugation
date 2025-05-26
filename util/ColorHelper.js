import chroma from "chroma-js";

export const createShadow = (hex) => {
  const color = chroma(hex);
  const adjustedColor = color.desaturate(0.6).darken(0.7).hex();

  return adjustedColor;
};

export const getHexWithOpacity = (hex, opacity) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
