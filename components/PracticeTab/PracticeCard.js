import { useState } from "react";
import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { responsiveScale } from "../util/ResponsiveScale";
import { Eye, EyeOff, LogIn } from "lucide-react-native";
import { getHexWithOpacity } from "../util/ColorHelper";
import { ShadowButton } from "../buttons/ShadowButton";
import { Pressable } from "react-native";
import { useModalStore } from "../stores/ModalStore";
import { createEmptyCard, FSRS, Rating } from "ts-fsrs";
import { db } from "../db/client";
import { srsReviews } from "../db/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import Animated, {
  interpolateColor,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useLocalStorageStore } from "../stores/LocalStorageStore";

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

const CorrectText = styled(Animated.Text)(({ theme }) => ({
  fontSize: theme.t7,
  color: "#22c55e",
  position: "absolute",
  right: theme.s2,
  pointerEvents: "none",
  fontFamily: "Inter_600SemiBold",
}));

export const PracticeCard = ({ item, incrementCard }) => {
  const theme = useTheme();

  const [focused, setFocused] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showInfinitive, setShowInfinitive] = useState(false);
  const [buttonColor, setButtonColor] = useState(theme.colors.primary);
  const [accentRowHeight, setAccentRowHeight] = useState(0);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, width: 0 });

  const incrementCardsStudied = useLocalStorageStore(
    (state) => state.incrementCardsStudied
  );
  const openModal = useModalStore((state) => state.openModal);

  const accents = ["á", "é", "í", "ó", "ú", "ñ"];

  const buttonScale = useSharedValue(1);
  const correctTextOpacity = useSharedValue(0);
  const correctTextTranslateY = useSharedValue(12);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedCorrectTextStyle = useAnimatedStyle(() => ({
    opacity: correctTextOpacity.value,
    transform: [{ translateY: correctTextTranslateY.value }],
  }));

  const insertAccent = (char) => {
    setUserAnswer((prev) => prev + char);
  };

  const handleSubmit = async () => {
    const correct =
      userAnswer.trim().toLowerCase() === item.conjugation.toLowerCase();
    const rating = correct ? Rating.Good : Rating.Again;
    const now = dayjs();

    try {
      const [existingReview] = await db
        .select()
        .from(srsReviews)
        .where(eq(srsReviews.conjugationId, item.id))
        .limit(1);

      let card = createEmptyCard();

      if (existingReview) {
        card.stability = existingReview.stability;
        card.difficulty = existingReview.difficulty;
        card.scheduled_days = existingReview.scheduledDays;
        card.learning_steps = existingReview.learningSteps;
        card.reps = existingReview.reps;
        card.lapses = existingReview.lapses;
        card.state = Number(existingReview.state); // TODO change schema so state is an integer
        card.last_review = dayjs.unix(existingReview.lastReviewAt).toDate();
        card.due = dayjs.unix(existingReview.dueAt).toDate();
      }

      const fsrs = new FSRS();
      const { card: resultCard } = fsrs.next(card, now.toDate(), rating);

      const reviewData = {
        dueAt: dayjs(resultCard.due).unix(),
        stability: resultCard.stability,
        difficulty: resultCard.difficulty,
        scheduledDays: resultCard.scheduled_days,
        learningSteps: resultCard.learning_steps,
        reps: resultCard.reps,
        lapses: resultCard.lapses,
        state: resultCard.state,
        lastReviewAt: now.unix(),
      };

      // if (existingReview) {
      //   await db
      //     .update(srsReviews)
      //     .set(reviewData)
      //     .where(eq(srsReviews.id, existingReview.id));
      // } else {
      //   await db.insert(srsReviews).values({
      //     conjugationId: item.id,
      //     ...reviewData,
      //   });
      // }
    } catch (err) {
      console.error("Failed to update SRS review:", err);
    }

    if (correct) {
      correctTextOpacity.value = withTiming(1, { duration: 160 });
      correctTextTranslateY.value = withTiming(0, { duration: 160 });
      setButtonColor("#22c55e");

      buttonScale.value = withSequence(
        withTiming(1.12, { duration: 90 }),
        withSpring(1, { mass: 1, stiffness: 240, damping: 14 })
      );

      setTimeout(() => {
        correctTextOpacity.value = withTiming(0, { duration: 140 });
        correctTextTranslateY.value = withTiming(10, { duration: 140 });
        setButtonColor(theme.colors.primary);
        handleIncrement();
      }, 600);
    } else {
      openModal("WRONG_ANSWER", {
        english: item.translation,
        infinitive: item.infinitive,
        userAnswer,
        correctAnswer: item.conjugation,
        incrementCard: handleIncrement,
      });
    }
  };

  const handleIncrement = () => {
    incrementCardsStudied();
    incrementCard();
    setUserAnswer("");
    setShowInfinitive(false);
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
          value={userAnswer}
          onChangeText={setUserAnswer}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          focused={focused}
        />
      </AnswerContainer>
      <CorrectText
        style={[
          animatedCorrectTextStyle,
          {
            bottom: accentRowHeight + theme.s2,
            left: buttonLayout.x + buttonLayout.width / 3,
          },
        ]}
      >
        Correct!
      </CorrectText>
      <AccentRow
        onLayout={(e) => setAccentRowHeight(e.nativeEvent.layout.height)}
      >
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
        <Animated.View
          style={animatedButtonStyle}
          onLayout={(e) => {
            const { x, width } = e.nativeEvent.layout;
            setButtonLayout({ x, width });
          }}
        >
          <ShadowButton
            width={responsiveScale(40)}
            height={responsiveScale(40)}
            buttonColor={buttonColor}
            onPressHandler={handleSubmit}
            icon={
              <LogIn
                size={theme.t7}
                color={theme.colors.white}
                strokeWidth={2.5}
              />
            }
          />
        </Animated.View>
      </AccentRow>
    </Container>
  );
};

PracticeCard.whyDidYouRender = true;
