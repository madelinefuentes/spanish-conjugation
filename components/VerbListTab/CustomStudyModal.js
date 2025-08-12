import { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { PracticeCard } from "../PracticeTab/PracticeCard";
import styled from "@emotion/native";
import { ProgressBar } from "../PracticeTab/ProgressBar";
import { BackHandler } from "react-native";

// TODO avoid statusbar properly
const ModalContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
  paddingTop: theme.s6,
}));

export const CustomStudyModal = ({ cards, isVisible, closeModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const backAction = () => {
      if (isVisible) {
        closeModal();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isVisible]);

  const incrementCard = async () => {
    if (currentIndex == cards.length - 1) {
      closeModal();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!cards) return;

  return (
    <Modal
      style={{
        margin: 0,
      }}
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={100}
      animationInTiming={100}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      coverScreen={false}
      // deviceHeight={height}
    >
      <ModalContainer>
        <ProgressBar cardsStudied={currentIndex} sessionCount={cards.length} />
        <PracticeCard
          item={cards[currentIndex]}
          incrementCard={incrementCard}
        />
      </ModalContainer>
    </Modal>
  );
};
