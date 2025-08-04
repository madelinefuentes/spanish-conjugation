import { useState } from "react";
import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { responsiveScale } from "../util/ResponsiveScale";
import { Eye, EyeOff, LogIn } from "lucide-react-native";
import { getHexWithOpacity } from "../util/ColorHelper";
import { ShadowButton } from "../buttons/ShadowButton";
import { Pressable } from "react-native";
import { CorrectionModal } from "./CorrectionModal";

const Container = styled.View(({ theme }) => ({
  alignItems: "center",
  paddingTop: theme.s4,
}));

const Prompt = styled.Text(({ theme }) => ({
  fontSize: theme.t12,
  color: theme.colors.text,
  marginBottom: theme.s6,
}));

const TenseRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  gap: theme.s3,
  marginBottom: theme.s4,
}));

const TenseContainer = styled.View(({ theme, color }) => ({
  paddingVertical: theme.s1,
  paddingHorizontal: theme.s3,
  borderRadius: 999,
  backgroundColor: getHexWithOpacity(color, 0.2),
  flexDirection: "row",
  alignItems: "center",
  gap: theme.s2,
}));

const Tense = styled.Text(({ theme, color }) => ({
  fontSize: theme.t6,
  color: color,
}));

const Pronoun = styled.Text(({ theme }) => ({
  fontSize: theme.t10,
  color: theme.colors.text,
}));

const StyledInput = styled.TextInput(({ theme, focused }) => ({
  borderBottomWidth: 2,
  borderBottomColor: focused ? theme.colors.primary : theme.colors.line,
  fontSize: theme.t10,
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
  width: "85%",
  borderRadius: theme.s4,
  padding: theme.s3,
  alignItems: "center",
  borderWidth: 1.5,
  borderBottomWidth: 4,
  borderColor: theme.colors.line,
}));

export const PracticeCard = ({ item }) => {
  const [focused, setFocused] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showInfinitive, setShowInfinitive] = useState(false);
  const [isCorrectionModalVisible, setIsCorrectionModalVisible] =
    useState(false);

  const theme = useTheme();

  const accents = ["á", "é", "í", "ó", "ú", "ñ"];

  const insertAccent = (char) => {
    setAnswer((prev) => prev + char);
  };

  const handleSubmit = () => {
    const correct =
      answer.trim().toLowerCase() === item.conjugation.toLowerCase();

    if (correct) {
    } else {
      setIsCorrectionModalVisible(true);
    }
  };

  if (!item) return;

  return (
    <Container>
      <Prompt>{item.translation}</Prompt>
      <TenseRow>
        <TenseContainer color={theme.colors.primary}>
          <Tense color={theme.colors.primary}>
            {item.tense.charAt(0).toUpperCase() + item.tense.slice(1)}
          </Tense>
        </TenseContainer>
        <Pressable onPress={() => setShowInfinitive(!showInfinitive)}>
          <TenseContainer color={"#a78bfa"}>
            {showInfinitive ? (
              <Eye size={theme.t7} color={"#a78bfa"} />
            ) : (
              <EyeOff size={theme.t7} color={"#a78bfa"} />
            )}
            <Tense color={"#a78bfa"}>
              {showInfinitive ? "Hide Verb" : "Reveal Verb"}
            </Tense>
          </TenseContainer>
        </Pressable>
      </TenseRow>
      <AnswerContainer>
        <Pronoun>
          {item.person + (showInfinitive ? " (" + item.infinitive + ")" : "")}
        </Pronoun>
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
              color={theme.colors.white}
              strokeWidth={2.5}
            />
          }
        />
      </AccentRow>
      {/* <CorrectionModal
        isVisible={isCorrectionModalVisible}
        closeModal={() => setIsCorrectionModalVisible(false)}
      /> */}
    </Container>
  );
};

PracticeCard.whyDidYouRender = true;
