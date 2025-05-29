import "../wdyr";
import { Text, View, TextInput, Pressable, SafeAreaView } from "react-native";
import setDefaultProps from "react-native-simple-default-props";
import { useLocalStorageStore } from "./stores/LocalStorageStore";
import { lightTheme, darkTheme } from "./themes/colorThemes";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/native";
import { Bean, Bubbles, Star } from "lucide-react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { PracticeScreen } from "./PracticeTab/PracticeScreen";
import {
  useFonts,
  Lato_400Regular,
  Barlow_400Regular,
} from "@expo-google-fonts/dev";
import { BottomTabs } from "./BottomTabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { seedVerbs } from "./db/seedVerbs";
import { clearDatabase, useDatabaseMigration } from "./db/client";

const StyledText = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: theme.colors.text,
}));

export default function App() {
  const themeSetting = useLocalStorageStore((state) => state.theme);
  const toggleTheme = useLocalStorageStore((state) => state.toggleTheme);
  const { success, error } = useDatabaseMigration();

  const isInDarkMode = themeSetting === "dark";
  const currentTheme = isInDarkMode ? darkTheme : lightTheme;

  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Barlow_400Regular,
  });

  const defaultText = {
    style: [{ fontFamily: "Lato_400Regular" }],
  };

  if (!fontsLoaded && !success) {
    return null;
  }

  setDefaultProps(Text, defaultText);
  setDefaultProps(TextInput, defaultText);

  return (
    <ThemeProvider theme={currentTheme}>
      <SafeAreaProvider>
        <AppContent theme={currentTheme} />
        {/* <PracticeScreen />
        <View
          style={{
            gap: 50,
            paddingTop: 40,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Pressable hitSlop={15} onPress={toggleTheme}>
            <Star size={23} color={currentTheme.colors.iconColor} />
          </Pressable>
          <Pressable hitSlop={15} onPress={seedVerbs}>
            <Bean size={23} color={currentTheme.colors.iconColor} />
          </Pressable>
          <Pressable hitSlop={15} onPress={clearDatabase}>
            <Bubbles size={23} color={currentTheme.colors.iconColor} />
          </Pressable>
        </View> */}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const AppContent = ({ theme }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        // paddingTop: insets.top,
        // paddingBottom: insets.bottom,
        // background: theme.colors.background,
      }}
    >
      <SystemBars style={theme.darkMode ? "light" : "dark"} />
      <NavigationContainer
        theme={{
          colors: {
            ...DefaultTheme.colors,
            background: theme.colors.background,
          },
        }}
      >
        <BottomTabs />
      </NavigationContainer>
    </View>
  );
};

App.whyDidYouRender = true;
