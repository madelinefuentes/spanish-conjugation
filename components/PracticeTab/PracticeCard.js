import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { responsiveScale } from "../util/ResponsiveScale";
import { LogIn } from "lucide-react-native";
import { getHexWithOpacity } from "../util/ColorHelper";
import { ShadowButton } from "../buttons/ShadowButton";

const Container = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: "center",
  paddingTop: theme.s6,
}));

const Prompt = styled.Text(({ theme }) => ({
  fontSize: theme.t14,
  color: theme.colors.text,
  marginBottom: theme.s3,
}));

const TenseContainer = styled.View(({ theme }) => ({
  paddingVertical: theme.s1,
  paddingHorizontal: theme.s3,
  borderRadius: 999,
  backgroundColor: getHexWithOpacity(theme.colors.primary, 0.2),
  marginBottom: theme.s7,
}));

const Tense = styled.Text(({ theme }) => ({
  fontSize: theme.t7,
  color: theme.colors.primary,
}));

const Pronoun = styled.Text(({ theme }) => ({
  fontSize: theme.t11,
  color: theme.colors.text,
}));

const StyledInput = styled.TextInput(({ theme, focused }) => ({
  borderBottomWidth: 2,
  borderBottomColor: focused
    ? theme.colors.primary
    : theme.colors.greyClickable,
  fontSize: theme.t11,
  color: theme.colors.text,
  marginBottom: theme.s4,
  width: "90%",
  textAlign: "center",
}));

const AccentRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  gap: theme.s2,
  marginTop: theme.s4,
}));

const AnswerContainer = styled.View(({ theme }) => ({
  backgroundColor: getHexWithOpacity("#ffffff", 0.05),
  width: "85%",
  borderRadius: theme.s4,
  padding: theme.s5,
  alignItems: "center",
  borderWidth: 1,
  borderColor: getHexWithOpacity("#ffffff", 0.1),
}));

export const PracticeCard = ({ item, onSubmit }) => {
  const [focused, setFocused] = useState(false);
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

  return (
    <Container>
      <Prompt>{item.english}</Prompt>
      <TenseContainer>
        <Tense>{item.tense}</Tense>
      </TenseContainer>
      <AnswerContainer>
        <Pronoun>{item.subject}</Pronoun>
        <StyledInput
          value={answer}
          onChangeText={setAnswer}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          focused={focused}
        />
      </AnswerContainer>
      <AccentRow>
        {accents.map((accent) => (
          <ShadowButton
            key={accent}
            width={responsiveScale(40)}
            height={responsiveScale(40)}
            buttonColor={theme.colors.greyClickable}
            buttonTextColor={theme.colors.text}
            onPressHandler={() => insertAccent(accent)}
            text={accent}
            fontSize={theme.t7}
          />
        ))}
        <ShadowButton
          width={responsiveScale(40)}
          height={responsiveScale(40)}
          buttonColor={theme.colors.primary}
          onPressHandler={handleSubmit}
          icon={
            <LogIn
              size={theme.t7}
              color={theme.colors.iconColor}
              strokeWidth={2.5}
            />
          }
        />
      </AccentRow>
    </Container>
  );
};

PracticeCard.whyDidYouRender = true;
