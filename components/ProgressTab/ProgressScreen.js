import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { ScrollView } from "react-native";
import { Flame, BookOpen } from "lucide-react-native";
import dayjs from "dayjs";
import { responsiveScale } from "../util/ResponsiveScale";

// ---------- Styled ----------
const Container = styled(ScrollView)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
  padding: theme.s4,
}));

const Header = styled.View(({ theme }) => ({
  marginBottom: theme.s5,
}));

const HeaderSubtitle = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: theme.colors.greyText,
}));

const HeaderStatus = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: theme.colors.text,
  marginTop: theme.s1,
}));

const Row = styled.View(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: theme.s4,
  marginBottom: theme.s5,
}));

const StatCard = styled.View(({ theme }) => ({
  borderRadius: theme.s4,
  paddingVertical: theme.s3,
  paddingHorizontal: theme.s4,
  borderWidth: 1.5,
  borderBottomWidth: 4,
  borderColor: theme.colors.line,
  flexDirection: "row",
  gap: theme.s3,
}));

const StatSubsection = styled.View(({ theme }) => ({}));

const StatValue = styled.Text(({ theme }) => ({
  fontSize: theme.t8,
  fontFamily: "Inter_600SemiBold",
  color: theme.colors.text,
}));

const StatLabel = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: theme.colors.greyText,
  marginTop: theme.s1,
}));

const Section = styled.View(({ theme }) => ({
  marginBottom: theme.s5,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  fontFamily: "Inter_600SemiBold",
  color: theme.colors.text,
  marginBottom: theme.s2,
}));

const ProgressRow = styled.View(({ theme }) => ({
  marginBottom: theme.s4,
}));

const ProgressLabel = styled.Text(({ theme }) => ({
  fontSize: theme.t5,
  color: theme.colors.text,
  marginBottom: theme.s1,
}));

const ProgressBarBackground = styled.View(({ theme }) => ({
  height: 10,
  borderRadius: 999,
  backgroundColor: theme.colors.line,
}));

const ProgressBarFill = styled.View(({ pct, color }) => ({
  height: "100%",
  width: `${pct}%`,
  borderRadius: 999,
  backgroundColor: color,
}));

export const ProgressScreen = () => {
  const theme = useTheme();

  // TODO replace with db queries
  const streakDays = 5;
  const cardsStudied = 12;
  const totalDue = 20;
  const tenseMastery = [
    { label: "Indicative · Present", pct: 70 },
    { label: "Indicative · Past", pct: 40 },
    { label: "Subjunctive · Present", pct: 20 },
  ];

  // status message
  let statusMessage = "You're all done for today 🎉";
  if (cardsStudied === 0) {
    statusMessage = "No reviews yet, start your first one ✨";
  } else if (cardsStudied < totalDue) {
    statusMessage = `${totalDue - cardsStudied} reviews remaining today`;
  }

  return (
    <Container>
      <Header>
        {/* <HeaderTitle>Progress</HeaderTitle> */}
        <HeaderSubtitle>{dayjs().format("dddd, MMM D")}</HeaderSubtitle>
        <HeaderStatus>{statusMessage}</HeaderStatus>
      </Header>

      {/* Stats row */}
      <Row>
        <StatCard>
          <Flame
            size={20}
            color="#f59e0b"
            fill="#f59e0b"
            style={{ marginTop: responsiveScale(5) }}
          />
          <StatSubsection>
            <StatValue>{streakDays}</StatValue>
            <StatLabel>Daily streak</StatLabel>
          </StatSubsection>
        </StatCard>

        <StatCard>
          <BookOpen
            size={20}
            color={theme.colors.primary}
            style={{ marginTop: responsiveScale(5) }}
          />
          <StatSubsection>
            <StatValue>{cardsStudied}</StatValue>
            <StatLabel>Cards studied</StatLabel>
          </StatSubsection>
        </StatCard>
      </Row>

      {/* Tense mastery */}
      <Section>
        <SectionTitle>Tense mastery</SectionTitle>
        {tenseMastery.map((t) => (
          <ProgressRow key={t.label}>
            <ProgressLabel>{t.label}</ProgressLabel>
            <ProgressBarBackground>
              <ProgressBarFill pct={t.pct} color={theme.colors.primary} />
            </ProgressBarBackground>
          </ProgressRow>
        ))}
      </Section>
    </Container>
  );
};
