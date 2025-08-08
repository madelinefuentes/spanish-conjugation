import { useModalStore } from "./stores/ModalStore";
import { useCallback, useEffect, memo, useMemo } from "react";
import { BackHandler } from "react-native";
import { WrongAnswerModal } from "./PracticeTab/WrongAnswerModal";
import { CustomStudyModal } from "./VerbListTab/CustomStudyModal";

export const ModalManager = memo(() => {
  const modals = useModalStore((state) => state.modals);
  const closeModal = useModalStore((state) => state.closeModal);

  const closeWrongAnswerModal = useCallback(
    () => closeModal("WRONG_ANSWER"),
    [closeModal]
  );

  const closeCustomStudyModal = useCallback(
    () => closeModal("CUSTOM_STUDY"),
    [closeModal]
  );

  return (
    <>
      <WrongAnswerModal
        isVisible={modals.WRONG_ANSWER.isVisible}
        {...modals.WRONG_ANSWER.props}
        closeModal={closeWrongAnswerModal}
      />
      <CustomStudyModal
        isVisible={modals.CUSTOM_STUDY.isVisible}
        {...modals.CUSTOM_STUDY.props}
        closeModal={closeCustomStudyModal}
      />
    </>
  );
});

ModalManager.whyDidYouRender = true;
