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
  paddingTop: theme.s7,
}));

const Prompt = styled.Text(({ theme }) => ({
  fontSize: theme.t15,
  color: theme.colors.text,
  marginBottom: theme.s3,
  textAlign: "center",
  fontFamily: "Inter_500Medium",
}));

const TenseContainer = styled.View(({ theme }) => ({
  paddingVertical: theme.s1,
  paddingHorizontal: theme.s3,
  borderRadius: theme.s3,
  marginBottom: theme.s6,
  // backgroundColor: getHexWithOpacity("#ff6a00", 0.15),
}));

const Tense = styled.Text(({ theme }) => ({
  fontSize: theme.t8,
  color: theme.colors.buttonOutline,
}));

const Pronoun = styled.Text(({ theme }) => ({
  fontSize: theme.t13,
  color: theme.colors.text,
  fontFamily: "Inter_500Medium",
  textAlign: "center",
}));

const StyledInput = styled.TextInput(({ theme, focused }) => ({
  borderBottomWidth: 2,
  borderBottomColor: focused
    ? theme.colors.primary
    : theme.colors.greyBackground,
  fontSize: theme.t11,
  paddingVertical: theme.s1,
  color: theme.colors.text,
  textAlign: "center",
  marginBottom: theme.s4,
  width: responsiveScale(280),
}));

const AccentRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  gap: theme.s2,
  justifyContent: "center",
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
      <Pronoun>{item.subject}</Pronoun>
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
        <AccentButton
          onPress={handleSubmit}
          style={{ backgroundColor: theme.colors.primary }}
        >
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
