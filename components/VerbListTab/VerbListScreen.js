import styled from "@emotion/native";
import { FlatList, Pressable, View } from "react-native";
import { db } from "../db/client";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { verbs } from "../db/schema";
import { useMemo, useState } from "react";
import { useLocalStorageStore } from "../stores/LocalStorageStore";
import { getHexWithOpacity } from "../util/ColorHelper";
import { useTheme } from "@emotion/react";
import { Search } from "lucide-react-native";

const ScreenContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const VerbCard = styled.View(({ theme }) => ({
  padding: theme.s3,
  paddingHorizontal: theme.s5,
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

const SortContainer = styled.View(({ theme }) => ({
  flexDirection: "row",
  gap: theme.s3,
  padding: theme.s3,
}));

const SortField = styled.View(({ theme, isActive }) => ({
  paddingVertical: theme.s1,
  paddingHorizontal: theme.s3,
  borderRadius: 999,
  backgroundColor: isActive
    ? getHexWithOpacity(theme.colors.primary, 0.2)
    : theme.colors.greyDisabled,
}));

const SortText = styled.Text(({ theme, isActive }) => ({
  fontSize: theme.t6,
  color: isActive ? theme.colors.primary : theme.colors.greyText,
}));

const HeaderContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyBackground,
  paddingVertical: theme.s1,
  paddingHorizontal: theme.s5,
  // borderBottomWidth: 1,
  // borderColor: theme.colors.line,
}));

const HeaderText = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  fontWeight: "bold",
  color: theme.colors.text,
}));

const SearchInput = styled.TextInput(({ theme }) => ({
  paddingVertical: theme.s2,
  paddingHorizontal: theme.s3,
  borderRadius: theme.s2,
  borderWidth: 1,
  borderColor: theme.colors.line,
  color: theme.colors.text,
  fontSize: theme.t6,
  flex: 1,
}));

const SearchContainer = styled.View(({ theme }) => ({
  flexDirection: "row",
  gap: theme.s3,
  marginTop: theme.s2,
  marginHorizontal: theme.s3,
  alignItems: "center",
}));

export const VerbListScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const sortField = useLocalStorageStore((state) => state.sortField);
  const setSortField = useLocalStorageStore((state) => state.setSortField);

  const theme = useTheme();

  const { data: rawVerbs, error } = useLiveQuery(db.select().from(verbs));

  const verbList = useMemo(() => {
    const filtered = rawVerbs.filter(
      (v) =>
        v.infinitive.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortField === "frequency") {
        return (b.frequency ?? 0) - (a.frequency ?? 0);
      }
      return a.infinitive.localeCompare(b.infinitive);
    });
  }, [rawVerbs, sortField, searchQuery]);

  const getHeader = (verb, sortField) => {
    if (sortField === "frequency") {
      const scaled = Math.floor((verb.frequency ?? 0) * 1000);
      const bucketStart = Math.floor(scaled / 100) * 100 + 1;
      const bucketEnd = bucketStart + 99;
      return `${bucketStart}–${bucketEnd}`;
    }

    return verb.infinitive[0].toUpperCase();
  };

  const { flatData, stickyIndices } = useMemo(() => {
    const grouped = [];

    verbList.forEach((verb) => {
      const header = getHeader(verb, sortField);

      if (!grouped[header]) grouped[header] = [];
      grouped[header].push(verb);
    });

    const flatData = [];
    const stickyIndices = [];

    Object.entries(grouped).forEach(([header, verbs]) => {
      stickyIndices.push(flatData.length);
      flatData.push({ type: "header", header });
      for (const verb of verbs) {
        flatData.push({ type: "verb", ...verb });
      }
    });

    return { flatData, stickyIndices };
  }, [verbList, sortField]);

  const renderItem = ({ item }) => {
    if (item.type === "header") {
      return (
        <HeaderContainer>
          <HeaderText>{item.header}</HeaderText>
        </HeaderContainer>
      );
    }

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
      <SearchContainer>
        <Search
          size={theme.t8}
          color={theme.colors.iconColor}
          strokeWidth={2.5}
        />
        <SearchInput
          placeholder="Search verbs..."
          placeholderTextColor={theme.colors.greyText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </SearchContainer>
      <SortContainer>
        <Pressable onPress={() => setSortField("alphabetical")} hitSlop={15}>
          <SortField isActive={sortField == "alphabetical"}>
            <SortText isActive={sortField == "alphabetical"}>
              Sort: A-Z
            </SortText>
          </SortField>
        </Pressable>
        <Pressable onPress={() => setSortField("frequency")} hitSlop={15}>
          <SortField isActive={sortField == "frequency"}>
            <SortText isActive={sortField == "frequency"}>Sort: Freq</SortText>
          </SortField>
        </Pressable>
      </SortContainer>
      <FlatList
        data={flatData}
        keyExtractor={(item, index) =>
          item.type === "header"
            ? `header-${item.header}`
            : item.infinitive + index
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};
