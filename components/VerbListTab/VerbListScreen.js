import styled from "@emotion/native";
import { useTheme } from "@emotion/react";
import { FlatList, View } from "react-native";
import { db } from "../db/client";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { verbs } from "../db/schema";

const ScreenContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const VerbCard = styled.View(({ theme }) => ({
  padding: theme.s3,
  paddingHorizontal: theme.s5,
  marginBottom: theme.s1,
  borderBottomWidth: 1,
  borderColor: theme.colors.line,
}));

const Infinitive = styled.Text(({ theme }) => ({
  fontSize: theme.t7,
  color: theme.colors.text,
  fontFamily: "Inter_500Medium",
}));

const Meaning = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: theme.colors.greyText,
  marginTop: theme.s1,
}));

const IrregularTag = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: "#f87171",
}));

const TopRow = styled.View(() => ({
  flexDirection: "row",
  justifyContent: "space-between",
}));

export const VerbListScreen = () => {
  const { data: verbList, error } = useLiveQuery(
    db.select().from(verbs).orderBy(verbs.infinitive)
  );
  const theme = useTheme();

  const renderVerb = ({ item }) => {
    const isIrregular = item.type === "Irregular";

    return (
      <VerbCard>
        <TopRow>
          <Infinitive>{item.infinitive}</Infinitive>
          {isIrregular && <IrregularTag>Irregular</IrregularTag>}
        </TopRow>
        <Meaning>{item.meaning}</Meaning>
      </VerbCard>
    );
  };

  return (
    <ScreenContainer>
      <FlatList
        data={verbList}
        keyExtractor={(item) => item.infinitive}
        renderItem={renderVerb}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};
