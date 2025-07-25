import Modal from "react-native-modal";
import styled from "@emotion/native";
import { Text, Pressable, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "@emotion/react";
import { getHexWithOpacity } from "../util/ColorHelper";
import { useState } from "react";

const ModalContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const Header = styled.View(({ theme }) => ({
  flexDirection: "row",
  height: theme.s7,
  marginHorizontal: theme.s3,
  alignItems: "center",
}));

const InfinitiveContainer = styled.View({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
});

const Infinitive = styled.Text(({ theme }) => ({
  fontSize: theme.t7,
  lineHeight: theme.t8,
  fontFamily: "Inter_500Medium",
  color: theme.colors.text,
}));

const MeaningContainer = styled.View(({ theme }) => ({
  padding: theme.s4,
  gap: theme.s3,
}));

const Meaning = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: theme.colors.text,
  fontFamily: "Inter_400Regular_Italic",
}));

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.line,
}));

const TagRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  gap: theme.s3,
}));

const TagContainer = styled.View(({ theme, color }) => ({
  paddingVertical: theme.s1,
  paddingHorizontal: theme.s3,
  borderRadius: 999,
  backgroundColor: getHexWithOpacity(color, 0.2),
}));

const TagText = styled.Text(({ theme, color }) => ({
  fontSize: theme.t5,
  color,
}));

export const VerbModal = ({ verb, isVisible, closeModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const theme = useTheme();

  const typeColor = verb.type == "Regular" ? "#4ade80" : "#f87171";

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
        <Header>
          <Pressable onPress={closeModal} hitSlop={15}>
            <ChevronLeft size={theme.t13} color={theme.colors.iconColor} />
          </Pressable>
          <InfinitiveContainer>
            <Infinitive>{verb.infinitive}</Infinitive>
          </InfinitiveContainer>
          <View style={{ width: theme.t13 }} />
        </Header>
        <Divider />
        <MeaningContainer>
          <Meaning>{verb.meaning}</Meaning>
          <TagRow>
            <TagContainer color={typeColor}>
              <TagText color={typeColor}>{verb.type}</TagText>
            </TagContainer>
            {verb.infinitive && verb.infinitive.slice(-2) == "se" && (
              <TagContainer color={theme.colors.primary}>
                <TagText color={theme.colors.primary}>Reflexive</TagText>
              </TagContainer>
            )}
          </TagRow>
        </MeaningContainer>
        <Divider />
        <TabControl
          tabs={["Indicative", "Subjunctive", "Imperative"]}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </ModalContainer>
    </Modal>
  );
};

const TabContainer = styled.View(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-around",
  backgroundColor: theme.colors.greyDisabled,
  margin: theme.s3,
  borderRadius: theme.s2,
}));

const TabButton = styled.View(({ theme }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: theme.s2,
}));

const TabText = styled.Text(({ theme, isActive }) => ({
  color: isActive ? theme.colors.text : theme.colors.greyText,
  fontSize: theme.t4,
  fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
}));

const MoodDescription = styled.Text(({ theme }) => ({
  paddingHorizontal: theme.s5,
  color: theme.colors.text,
  fontSize: theme.t4,
  textAlign: "center",
}));

export const TabControl = ({ tabs, activeIndex, setActiveIndex }) => {
  const moodExplanations = {
    Indicative: "Used to state facts, describe reality, or ask questions",
    Subjunctive: "Expresses doubt, wishes, or hypothetical situations",
    Imperative: "Gives commands or requests",
  };

  return (
    <>
      <TabContainer>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <Pressable key={tab} onPress={() => setActiveIndex(index)}>
              <TabButton isActive={isActive}>
                <TabText isActive={isActive}>{tab}</TabText>
              </TabButton>
            </Pressable>
          );
        })}
      </TabContainer>

      <MoodDescription>
        <Text>{moodExplanations[tabs[activeIndex]]}</Text>
      </MoodDescription>
    </>
  );
};
