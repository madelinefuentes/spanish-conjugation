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
  Manrope_400Regular,
} from "@expo-google-fonts/dev";
import { BottomTabs } from "./BottomTabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDatabaseMigration } from "./db/client";

export default function App() {
  const themeSetting = useLocalStorageStore((state) => state.theme);
  const { success, error } = useDatabaseMigration();

  const isInDarkMode = themeSetting === "dark";
  const currentTheme = isInDarkMode ? darkTheme : lightTheme;

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const defaultText = {
    style: [{ fontFamily: "Inter_400Regular" }],
  };

  if (!fontsLoaded && !success) {
    return null;
  }

  setDefaultProps(Text, defaultText);
  setDefaultProps(TextInput, defaultText);

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
    </View>
  );
};

App.whyDidYouRender = true;
