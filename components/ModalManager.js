import { useModalStore } from "./stores/ModalStore";
import { useCallback, useEffect, memo, useMemo } from "react";
import { BackHandler } from "react-native";
import { WrongAnswerModal } from "./PracticeTab/WrongAnswerModal";

export const ModalManager = memo(() => {
  const modals = useModalStore((state) => state.modals);
  const closeModal = useModalStore((state) => state.closeModal);

  const closeWrongAnswerModal = useCallback(
    () => closeModal("WRONG_ANSWER"),
    [closeModal]
  );

  return (
    <>
      <WrongAnswerModal
        isVisible={modals.WRONG_ANSWER.isVisible}
        {...modals.WRONG_ANSWER.props}
        closeModal={closeWrongAnswerModal}
      />
    </>
  );
});

ModalManager.whyDidYouRender = true;
