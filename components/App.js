import "../wdyr";
import { Text, View, TextInput } from "react-native";
import setDefaultProps from "react-native-simple-default-props";
import { useLocalStorageStore } from "./stores/LocalStorageStore";
import { lightTheme, darkTheme } from "./themes/colorThemes";
import { ThemeProvider, useTheme } from "@emotion/react";
import { SystemBars } from "react-native-edge-to-edge";
import {
  useFonts,
  Lato_400Regular,
  Barlow_400Regular,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_400Regular_Italic,
  Manrope_400Regular,
} from "@expo-google-fonts/dev";
import { BottomTabs } from "./BottomTabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { initDb, useDatabaseMigration } from "./db/client";
import { ModalManager } from "./ModalManager";
import { useEffect, useState } from "react";

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const themeSetting = useLocalStorageStore((state) => state.theme);

  const isInDarkMode = themeSetting === "dark";
  const currentTheme = isInDarkMode ? darkTheme : lightTheme;

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_400Regular_Italic,
  });

  const intializeDb = async () => {
    try {
      await initDb();
      setDbReady(true);
    } catch (e) {
      console.warn("DB init failed", e);
    }
  };

  useEffect(() => {
    intializeDb();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      const defaultText = { style: [{ fontFamily: "Inter_400Regular" }] };
      setDefaultProps(Text, defaultText);
      setDefaultProps(TextInput, defaultText);
    }
  }, [fontsLoaded]);

  const ready = fontsLoaded && dbReady;

  if (!ready) return null;

  return (
    <ThemeProvider theme={currentTheme}>
      <SafeAreaProvider>
        <SystemBars style={isInDarkMode ? "light" : "dark"} />
        <NavigationContainer
          theme={{
            colors: {
              ...DefaultTheme.colors,
              background: currentTheme.colors.background,
            },
          }}
        >
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
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
  );
};

App.whyDidYouRender = true;
