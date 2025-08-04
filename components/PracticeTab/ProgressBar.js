import { Pressable, View } from "react-native";
import styled from "@emotion/native";
import { responsiveScale } from "../util/ResponsiveScale";
import { Eye, EyeClosed } from "lucide-react-native";
import { useTheme } from "@emotion/react";
import { useLocalStorageStore } from "../stores/LocalStorageStore";

const Container = styled.View(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: theme.s3,
}));

const BarContainer = styled.View(({ theme }) => ({
  height: theme.s4,
  backgroundColor: theme.colors.greyBackground,
  borderRadius: theme.s3,
  overflow: "hidden",
  marginHorizontal: theme.s3,
  flex: 1,
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

const VisibleSection = styled.View(() => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
}));

export const ProgressBar = ({}) => {
  const cardsStudied = useLocalStorageStore((state) => state.cardsStudied);
  const sessionCount = useLocalStorageStore((state) => state.sessionCount);
  const isProgressVisible = useLocalStorageStore(
    (state) => state.isProgressVisible
  );
  const toggleProgressVisible = useLocalStorageStore(
    (state) => state.toggleProgressVisible
  );

  const theme = useTheme();

  return (
    <Container>
      <Pressable onPress={toggleProgressVisible}>
        {isProgressVisible ? (
          <Eye size={theme.t11} color={theme.colors.iconColor} />
        ) : (
          <EyeClosed size={theme.t11} color={theme.colors.iconColor} />
        )}
      </Pressable>
      {isProgressVisible && (
        <VisibleSection>
          <BarContainer>
            <BarFill
              style={{
                width: `${Math.min(1, cardsStudied / sessionCount) * 100}%`,
              }}
            >
              <BarHighlight />
            </BarFill>
          </BarContainer>
          <StyledText>{`${cardsStudied} / ${sessionCount}`}</StyledText>
        </VisibleSection>
      )}
    </Container>
  );
};
