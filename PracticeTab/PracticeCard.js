import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { responsiveScale } from "../util/ResponsiveScale";
import { LogIn } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getHexWithOpacity } from "../util/ColorHelper";

// import {
//   useAnimatedKeyboard,
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from "react-native-reanimated";

const Container = styled.View(({ theme }) => ({
  alignItems: "center",
  marginTop: theme.s10,
}));

const Prompt = styled.Text(({ theme }) => ({
  fontSize: theme.t14,
  fontWeight: "600",
  color: theme.colors.text,
  marginBottom: theme.s4,
  textAlign: "center",
}));

const Subject = styled.Text(({ theme }) => ({
  fontSize: theme.t12,
  fontWeight: "600",
  color: theme.colors.text,
  textAlign: "center",
}));

const TenseContainer = styled.View(({ theme }) => ({
  padding: theme.s2,
  paddingHorizontal: theme.s3,
  borderRadius: theme.s2,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.s8,
  // backgroundColor: "#E6F7FF",
  borderRadius: theme.s3,
}));

const Tense = styled.Text(({ theme }) => ({
  fontSize: theme.t9,
  color: theme.colors.buttonOutline,
}));

const StyledInput = styled.TextInput(({ theme, focused }) => ({
  borderBottomWidth: 3,
  borderBottomColor: focused
    ? theme.colors.primary
    : theme.colors.greyBackground,
  fontSize: theme.t12,
  color: theme.colors.text,
  textAlign: "center",
  marginTop: theme.s1,
  marginBottom: theme.s4,
  width: responsiveScale(300),
}));

const AccentRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  gap: theme.s2,
  marginBottom: theme.s3,
}));

const AccentButton = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyClickable,
  width: responsiveScale(40),
  height: responsiveScale(40),
  borderRadius: theme.s1,
  alignItems: "center",
  justifyContent: "center",
}));

const AccentText = styled.Text(({ theme }) => ({
  color: theme.colors.text,
  fontSize: theme.t8,
}));

export const PracticeCard = ({ item, onSubmit }) => {
  const [answer, setAnswer] = useState("");
  const theme = useTheme();

  const accents = ["á", "é", "í", "ó", "ú", "ñ"];

  const insertAccent = (char) => {
    setAnswer((prev) => prev + char);
  };

  const handleSubmit = () => {
    const correct =
      answer.trim().toLowerCase() === item.correctAnswer.toLowerCase();
    onSubmit(correct);
  };

  const preteriteColor = "#ff6a00";

  return (
    <Container>
      <Prompt>{item.english}</Prompt>
      <TenseContainer
      // colors={[
      //   getHexWithOpacity(preteriteColor, 0.4),
      //   getHexWithOpacity(preteriteColor, 0.4),
      // ]}
      // start={[0, 0]}
      // end={[1, 1]}
      >
        <Tense>{item.tense}</Tense>
      </TenseContainer>
      <Subject>{item.subject}</Subject>
      <StyledInput
        value={answer}
        onChangeText={setAnswer}
        autoCapitalize="none"
        autoCorrect={false}
        // placeholder="Answer in Spanish"
      />
      <AccentRow>
        {accents.map((accent) => (
          <Pressable key={accent} onPress={() => insertAccent(accent)}>
            <AccentButton>
              <AccentText>{accent}</AccentText>
            </AccentButton>
          </Pressable>
        ))}
        <AccentButton onPress={handleSubmit}>
          <LogIn
            size={theme.t7}
            color={theme.colors.iconColor}
            strokeWidth={2.5}
          />
        </AccentButton>
      </AccentRow>
    </Container>
  );
};

PracticeCard.whyDidYouRender = true;
