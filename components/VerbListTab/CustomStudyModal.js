import { useState } from "react";
import Modal from "react-native-modal";
import { PracticeCard } from "../PracticeTab/PracticeCard";

export const CustomStudyModal = ({ cards, isVisible, closeModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <PracticeCard item={cards[currentIndex]} incrementCard={incrementCard} />
    </Modal>
  );
};
