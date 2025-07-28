import styled from "@emotion/native";
import { Text, Pressable, View } from "react-native";

const TabContainer = styled.View(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-around",
  backgroundColor: theme.colors.greyDisabled,
  margin: theme.s3,
  borderRadius: theme.s2,
}));

const TabButton = styled.View(({ theme, isActive }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: theme.s2,
  paddingHorizontal: theme.s4,
  borderBottomWidth: isActive ? 2 : 0,
  borderBottomColor: isActive ? theme.colors.primary : "transparent",
}));

const TabText = styled.Text(({ theme, isActive }) => ({
  color: isActive ? theme.colors.primary : theme.colors.greyText,
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
