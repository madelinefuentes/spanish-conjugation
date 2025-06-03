import { useState } from "react";
import { responsiveScale } from "../util/ResponsiveScale";
import styled from "@emotion/native";
import { createShadow } from "../util/ColorHelper";
import { Pressable } from "react-native";

const ButtonText = styled.Text(({ color, fontSize }) => ({
  textAlign: "center",
  color: color,
  fontSize,
}));

const OuterShadowContainer = styled.View(
  ({ shadowColor, isPressed, width }) => ({
    backgroundColor: shadowColor,
    borderRadius: responsiveScale(8),
    width: width,
    paddingBottom: isPressed ? 0 : responsiveScale(3.5),
    marginTop: isPressed ? responsiveScale(3.5) : 0,
  })
);

const InnerContainer = styled.View(({ theme, buttonColor }) => ({
  flexDirection: "row",
  backgroundColor: buttonColor,
  borderRadius: responsiveScale(7),
  width: "100%",
  gap: theme.s2,
  justifyContent: "center",
  alignItems: "center",
}));

export const ShadowButton = ({
  width,
  height,
  buttonColor,
  buttonTextColor,
  onPressHandler,
  icon,
  text,
  fontSize,
}) => {
  const [buttonIsPressed, setButtonIsPressed] = useState(false);
  const shadowColor = createShadow(buttonColor);

  return (
    <Pressable
      onPress={onPressHandler}
      onPressIn={() => setButtonIsPressed(true)}
      onPressOut={() => setButtonIsPressed(false)}
    >
      <OuterShadowContainer
        isPressed={buttonIsPressed}
        shadowColor={shadowColor}
        width={width}
      >
        <InnerContainer buttonColor={buttonColor} height={height}>
          {icon}
          {text && (
            <ButtonText color={buttonTextColor} fontSize={fontSize}>
              {text}
            </ButtonText>
          )}
        </InnerContainer>
      </OuterShadowContainer>
    </Pressable>
  );
};

ShadowButton.whyDidYouRender = true;
