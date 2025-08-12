import Modal from "react-native-modal";
import styled from "@emotion/native";
import { Text, Pressable, View, ScrollView } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "@emotion/react";
import { getHexWithOpacity } from "../util/ColorHelper";
import { useEffect, useState } from "react";
import { TabControl } from "./TabControl";
import { db } from "../db/client";
import { conjugations } from "../db/schema";
import { eq } from "drizzle-orm";
import { useModalStore } from "../stores/ModalStore";
import {
  getConjugationsByVerb,
  getConjugationsByVerbAndTense,
} from "../db/dbFunctions";

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

const MeaningBlock = styled.View(({ theme }) => ({
  padding: theme.s4,
  gap: theme.s3,
}));

const MeaningRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
}));

const MeaningText = styled.Text(({ theme }) => ({
  flex: 1,
  fontSize: theme.t6,
  color: theme.colors.text,
  fontFamily: "Inter_400Regular_Italic",
  marginRight: theme.s3,
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

const QuizButton = styled.View(({ theme }) => ({
  paddingVertical: theme.s1,
  paddingHorizontal: theme.s3,
  borderRadius: theme.s3,
  borderWidth: 1,
  borderColor: theme.colors.primary,
}));

const QuizButtonText = styled.Text(({ theme }) => ({
  fontSize: theme.t5,
  color: theme.colors.white,
}));

export const moodArray = [
  {
    key: "indicative",
    label: "Indicative",
    tenses: {
      present: "Used to state facts or habitual actions",
      preterite: "Describes completed actions in the past",
      imperfect: "Describes ongoing or habitual past actions",
      future: "Describes actions that will happen",
      conditional: "Describes hypothetical or polite actions",
    },
  },
  {
    key: "subjunctive",
    label: "Subjunctive",
    tenses: {
      // present: "Expresses doubt, wishes, or emotions",
      // imperfect: "Used for hypotheticals in the past",
      // future: "Rarely used; expresses future hypotheticals",
    },
  },
  {
    key: "imperative",
    label: "Imperative",
    tenses: {
      // affirmative: "Gives direct commands or requests",
      // negative: "Tells someone not to do something",
    },
  },
];

export const VerbModal = ({ verb, isVisible, closeModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [conjugationData, setConjugationData] = useState({});

  const openModal = useModalStore((state) => state.openModal);
  const theme = useTheme();

  const handleQuizAll = async () => {
    const cards = await getConjugationsByVerb(verb.id);

    openModal("CUSTOM_STUDY", { cards });
  };

  useEffect(() => {
    const loadConjugations = async () => {
      try {
        const results = await db
          .select()
          .from(conjugations)
          .where(eq(conjugations.verbId, verb.id));

        const structured = {};

        for (const row of results) {
          if (!structured[row.mood]) {
            structured[row.mood] = {};
          }

          if (!structured[row.mood][row.tense]) {
            structured[row.mood][row.tense] = {};
          }

          structured[row.mood][row.tense][row.person] = {
            conjugation: row.conjugation,
            translation: row.translation,
          };
        }

        setConjugationData(structured);
      } catch (e) {
        console.error("Error loading conjugations:", e);
        setConjugationData([]);
      } finally {
        setLoading(false);
      }
    };

    if (verb) {
      loadConjugations();
    }
  }, [verb]);

  const moodData = moodArray[activeIndex];
  const { key: moodKey, tenses } = moodData;

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
        <ScrollView>
          <MeaningBlock>
            <MeaningRow>
              <MeaningText>{verb.meaning}</MeaningText>
              <Pressable onPress={handleQuizAll} hitSlop={15}>
                <QuizButton>
                  <QuizButtonText>Quiz All</QuizButtonText>
                </QuizButton>
              </Pressable>
            </MeaningRow>

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
          </MeaningBlock>
          <Divider />
          <TabControl
            tabs={["Indicative", "Subjunctive", "Imperative"]}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />

          {Object.entries(tenses).map(([tenseKey, description]) => {
            const tenseConjugations = conjugationData?.[moodKey]?.[tenseKey];

            if (!tenseConjugations) return null;

            return (
              <Table
                key={tenseKey}
                verbId={verb.id}
                tense={tenseKey}
                description={description}
                tenseConjugations={tenseConjugations}
              />
            );
          })}
        </ScrollView>
      </ModalContainer>
    </Modal>
  );
};

const TableContainer = styled.View(({ theme }) => ({
  padding: theme.s4,
}));

const TenseHeaderRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}));

const TenseHeader = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  fontFamily: "Inter_600SemiBold",
  color: theme.colors.text,
}));

const DescriptionText = styled.Text(({ theme }) => ({
  fontSize: theme.t4,
  color: theme.colors.greyText,
  marginBottom: theme.s2,
}));

const ConjugationTable = styled.View(({ theme }) => ({
  borderRadius: theme.s3,
  borderWidth: 1,
  borderBottomWidth: 3,
  borderColor: theme.colors.line,
}));

const Row = styled.View(({ theme, isLastRow }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.s3,
  borderBottomWidth: isLastRow ? 0 : 1,
  borderBottomColor: theme.colors.line,
}));

const Spanish = styled.Text(({ theme }) => ({
  fontSize: theme.t5,
  fontFamily: "Inter_500Medium",
  color: theme.colors.text,
}));

const English = styled.Text(({ theme }) => ({
  fontSize: theme.t5,
  fontFamily: "Inter_400Regular",
  color: theme.colors.greyText,
}));

const Table = ({ verbId, tense, description, tenseConjugations }) => {
  const openModal = useModalStore((state) => state.openModal);

  const subjects = ["yo", "tú", "él", "ellos", "nosotros"];

  const handleQuiz = async () => {
    const cards = await getConjugationsByVerbAndTense(verbId, tense);

    openModal("CUSTOM_STUDY", { cards });
  };

  return (
    <TableContainer>
      <TenseHeaderRow>
        <TenseHeader>
          {tense.charAt(0).toUpperCase() + tense.slice(1)}
        </TenseHeader>
        <Pressable onPress={handleQuiz} hitSlop={15}>
          <QuizButton>
            <QuizButtonText>Quiz</QuizButtonText>
          </QuizButton>
        </Pressable>
      </TenseHeaderRow>
      <DescriptionText>{description}</DescriptionText>
      <ConjugationTable>
        {subjects.map((s, i) => {
          const spanish = tenseConjugations[s].conjugation;
          const english = tenseConjugations[s].translation;

          return (
            <Row key={s} isLastRow={i == subjects.length - 1}>
              <Spanish>{s + " " + spanish}</Spanish>
              <English>{english}</English>
            </Row>
          );
        })}
      </ConjugationTable>
    </TableContainer>
  );
};
