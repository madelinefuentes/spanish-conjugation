import "../wdyr";
import { SQLiteProvider } from "expo-sqlite";
import { Text, View, TextInput } from "react-native";
import setDefaultProps from "react-native-simple-default-props";
import { useLocalStorageStore } from "./stores/LocalStorageStore";
import { lightTheme, darkTheme } from "./themes/colorThemes";
import { ThemeProvider, useTheme } from "@emotion/react";
import { SystemBars } from "react-native-edge-to-edge";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_400Regular_Italic,
} from "@expo-google-fonts/dev";
import { BottomTabs } from "./BottomTabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ModalManager } from "./ModalManager";
import { useUserDatabaseMigration } from "./db/client";

export default function App() {
  const themeSetting = useLocalStorageStore((s) => s.theme);
  const isInDarkMode = themeSetting === "dark";
  const currentTheme = isInDarkMode ? darkTheme : lightTheme;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_400Regular_Italic,
  });

  const defaultText = { style: [{ fontFamily: "Inter_400Regular" }] };
  if (!fontsLoaded) return null;

  setDefaultProps(Text, defaultText);
  setDefaultProps(TextInput, defaultText);

  return (
    <ThemeProvider theme={currentTheme}>
      <SafeAreaProvider>
        <SystemBars style={isInDarkMode ? "light" : "dark"} />
        <SQLiteProvider
          databaseName={"conjugations.db"}
          assetSource={{ assetId: require("../assets/conjugations.db") }}
          onInit={async (db) => {
            await db.execAsync("PRAGMA foreign_keys=ON;");
            await db.execAsync("PRAGMA journal_mode=WAL;");
          }}
        >
          <AppContent />
        </SQLiteProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const { success, error } = useUserDatabaseMigration();

  const insets = useSafeAreaInsets();
  const theme = useTheme();

  if (error) {
    console.error("User DB migration error:", error);
    return null;
  }
  if (!success) return null;

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: theme.colors.background },
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: theme.colors.background,
        }}
      >
        <BottomTabs />
        <ModalManager />
      </View>
    </NavigationContainer>
  );
};

AppContent.whyDidYouRender = true;
