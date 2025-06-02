import { Pressable } from "react-native";
import styled from "@emotion/native";
import { responsiveScale } from "../util/ResponsiveScale";
import { Eye } from "lucide-react-native";
import { useTheme } from "@emotion/react";

const Container = styled.View(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: theme.s3,
}));

const BarContainer = styled.View(({ theme }) => ({
  flex: 1,
  height: theme.s4,
  backgroundColor: "#E0E0E0",
  borderRadius: theme.s3,
  overflow: "hidden",
  marginHorizontal: theme.s3,
}));

const BarFill = styled.View(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.colors.primary,
  borderRadius: theme.s3,
  overflow: "hidden",
}));

const BarHighlight = styled.View(({ theme }) => ({
  position: "absolute",
  top: theme.s1,
  left: responsiveScale(6),
  right: responsiveScale(6),
  height: responsiveScale(5),
  borderRadius: theme.s3,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
}));

const StyledText = styled.Text(({ theme }) => ({
  color: theme.colors.text,
  fontSize: theme.t4,
  fontWeight: "600",
}));

export const ProgressBar = ({ progress = 0.6 }) => {
  const theme = useTheme();

  return (
    <Container>
      <Pressable>
        <Eye size={theme.t11} color={theme.colors.iconColor} />
      </Pressable>
      <BarContainer>
        <BarFill style={{ width: `${progress * 100}%` }}>
          <BarHighlight />
        </BarFill>
      </BarContainer>
      <StyledText>11/15</StyledText>
    </Container>
  );
};
