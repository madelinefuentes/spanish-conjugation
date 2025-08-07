import Modal from "react-native-modal";
import { Dimensions } from "react-native";
import styled from "@emotion/native";
import { CircleX, X, Check } from "lucide-react-native";
import { useTheme } from "@emotion/react";
import { ShadowButton } from "../buttons/ShadowButton";
import { responsiveScale } from "../util/ResponsiveScale";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";

const { height } = Dimensions.get("screen");

const ModalView = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.modalBackground,
  borderRadius: theme.s3,
  padding: theme.s3,
  alignItems: "center",
}));

const EnglishText = styled.Text(({ theme }) => ({
  color: theme.colors.text,
  fontSize: theme.t8,
  marginBottom: theme.s3,
}));

const AnswerText = styled.Text(({ theme }) => ({
  fontSize: theme.t8,
  color: theme.colors.text,
  lineHeight: theme.t12,
}));

const InfintiveText = styled.Text(({ theme }) => ({
  color: theme.colors.text,
  fontSize: theme.t8,
  fontFamily: "Inter_400Regular_Italic",
  marginBottom: theme.s4,
}));

const HeaderText = styled.Text(({ theme }) => ({
  color: theme.colors.text,
  fontSize: theme.t8,
  color: "#ef4444",
  lineHeight: theme.t11,
}));

const Header = styled.View(({ theme }) => ({
  height: theme.s5,
  width: "100%",
  alignItems: "center",
  gap: theme.s3,
  flexDirection: "row",
  marginBottom: theme.s4,
}));

const AnswerContainer = styled.View(({ theme }) => ({
  gap: theme.s3,
  flexDirection: "row",
  alignItems: "center",
}));

const BottomRow = styled.View(({ theme }) => ({
  alignSelf: "flex-end",
  marginTop: theme.s5,
}));

export const WrongAnswerModal = ({
  isVisible,
  closeModal,
  infinitive,
  correctAnswer,
  userAnswer,
  english,
  incrementCard,
}) => {
  const theme = useTheme();

  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 4 }],
  }));

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={200}
      animationInTiming={200}
      animationOutTiming={1}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      coverScreen={false}
      onBackButtonPress={closeModal}
      deviceHeight={height}
      onModalWillHide={incrementCard}
    >
      <Animated.View style={animatedStyles}>
        <ModalView>
          <Header>
            <CircleX size={theme.t10} color="#ef4444" />
            <HeaderText>Incorrect</HeaderText>
          </Header>
          <EnglishText>{`${english} - ${infinitive}`}</EnglishText>
          <AnswerContainer style={{ marginBottom: theme.s1 }}>
            <Check size={theme.t10} color="#22c55e" />
            <AnswerText>{correctAnswer}</AnswerText>
          </AnswerContainer>
          <AnswerContainer>
            <X size={theme.t10} color="#ef4444" />
            <AnswerText>{userAnswer || "[No answer]"}</AnswerText>
          </AnswerContainer>
          <BottomRow>
            <ShadowButton
              width={responsiveScale(100)}
              height={responsiveScale(35)}
              buttonColor={theme.colors.primary}
              buttonTextColor={theme.colors.text}
              onPressHandler={closeModal}
              text="Continue"
              fontSize={theme.t6}
            />
          </BottomRow>
        </ModalView>
      </Animated.View>
    </Modal>
  );
};

WrongAnswerModal.whyDidYouRender = true;
