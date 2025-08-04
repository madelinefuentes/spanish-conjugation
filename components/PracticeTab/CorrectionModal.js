import Modal from "react-native-modal";
import { Pressable, Keyboard, Dimensions, BackHandler } from "react-native";
import styled from "@emotion/native";
import { useEffect } from "react";

const { height } = Dimensions.get("screen");

const ModalView = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.modalBackground,
  borderRadius: theme.s1,
  padding: theme.s4,
}));

export const CorrectionModal = ({ isVisible, closeModal }) => {
  //   useEffect(() => {
  //     const backAction = () => {
  //       if (modalVisible) {
  //         closeModal();
  //         return true;
  //       }

  //       return false;
  //     };

  //     const backHandler = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       backAction
  //     );

  //     return () => backHandler.remove();
  //   }, [modalVisible]);

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
    >
      <ModalView style={{ paddingTop: 50, paddingBottom: 50 }}></ModalView>
    </Modal>
  );
};

CorrectionModal.whyDidYouRender = true;
