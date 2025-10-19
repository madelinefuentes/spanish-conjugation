import styled from "@emotion/native";
import { FlatList, Pressable, View } from "react-native";
import { db, presetDb } from "../db/client";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { verbs } from "../db/schema.preset";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorageStore } from "../stores/LocalStorageStore";
import { getHexWithOpacity } from "../util/ColorHelper";
import { useTheme } from "@emotion/react";
import { Search } from "lucide-react-native";
import { VerbModal } from "./VerbModal";

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

const PlaceholderText = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: theme.colors.text,
  textAlign: "center",
}));

const PlaceholderContainer = styled.View(({ theme }) => ({
  marginTop: theme.s10,
  marginHorizontal: theme.s5,
}));

const SideButtonText = styled.Text(({ theme }) => ({
  fontSize: theme.t4,
  color: theme.colors.greyText,
}));

export const VerbListScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVerbModalVisible, setIsVerbModalVisible] = useState(false);
  const [selectedVerb, setSelectedVerb] = useState({});
  const [verbList, setVerbList] = useState([]);

  const sortField = useLocalStorageStore((state) => state.sortField);
  const setSortField = useLocalStorageStore((state) => state.setSortField);

  const flatListRef = useRef();
  const theme = useTheme();

  const fetchVerbs = async () => {
    const result = await presetDb.select().from(verbs);
    setVerbList(result);
  };

  useEffect(() => {
    fetchVerbs();
  }, []);

  const filteredList = useMemo(() => {
    const filtered = verbList.filter(
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
  }, [verbList, sortField, searchQuery]);

  const getHeader = (verb, sortField) => {
    if (sortField === "frequency") {
      const scaled = Math.floor((verb.frequency ?? 0) * 1000);
      const bucketStart = Math.floor(scaled / 100) * 100 + 1;
      const bucketEnd = bucketStart + 99;
      return `${bucketStart}–${bucketEnd}`;
    }

    return verb.infinitive[0].toUpperCase();
  };

  const { flatData, headerIndices } = useMemo(() => {
    const grouped = [];

    filteredList.forEach((verb) => {
      const header = getHeader(verb, sortField);

      if (!grouped[header]) grouped[header] = [];
      grouped[header].push(verb);
    });

    const flatData = [];
    const headerIndices = {};
    let index = 0;

    Object.entries(grouped).forEach(([header, verbs]) => {
      headerIndices[header] = index;
      flatData.push({ type: "header", header });
      index++;

      for (const verb of verbs) {
        flatData.push({ type: "verb", ...verb });
        index++;
      }
    });

    return { flatData, headerIndices };
  }, [filteredList, sortField]);

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
      <Pressable onPress={() => openVerbModal(item)}>
        <VerbCard>
          <TopRow>
            <Infinitive>{item.infinitive}</Infinitive>
            {isIrregular && <IrregularTag>Irregular</IrregularTag>}
          </TopRow>
          <Meaning>{item.meaning}</Meaning>
        </VerbCard>
      </Pressable>
    );
  };

  const openVerbModal = (verb) => {
    setSelectedVerb(verb);
    setIsVerbModalVisible(true);
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
      {searchQuery.length > 0 && filteredList.length < 1 ? (
        <PlaceholderContainer>
          <PlaceholderText>{`There are no search results for '${searchQuery}'`}</PlaceholderText>
        </PlaceholderContainer>
      ) : (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <FlatList
            ref={flatListRef}
            data={flatData}
            keyExtractor={(item, index) =>
              item.type === "header"
                ? `header-${item.header}`
                : item.infinitive + index
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />

          <View
            style={{
              width: theme.s5,
              gap: theme.s3,
              alignItems: "center",
            }}
          >
            {Object.keys(headerIndices).map((header) => (
              <Pressable
                key={header}
                onPress={() => {
                  const index = headerIndices[header];
                  if (flatListRef.current && index !== undefined) {
                    flatListRef.current.scrollToIndex({
                      index,
                      animated: true,
                    });
                  }
                }}
                hitSlop={10}
              >
                <SideButtonText
                  style={{
                    transform:
                      sortField === "frequency"
                        ? [{ rotate: "-270deg" }]
                        : undefined,
                  }}
                >
                  {header.length > 4 ? header.slice(-3) : header}
                </SideButtonText>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <VerbModal
        verb={selectedVerb}
        isVisible={isVerbModalVisible}
        closeModal={() => setIsVerbModalVisible(false)}
      />
    </ScreenContainer>
  );
};
