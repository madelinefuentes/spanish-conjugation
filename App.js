import "./wdyr";
import { Text, View, TextInput, Pressable, SafeAreaView } from "react-native";
import setDefaultProps from "react-native-simple-default-props";
import { useLocalStorageStore } from "./stores/LocalStorageStore";
import { lightTheme, darkTheme } from "./themes/colorThemes";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/native";
import { Star } from "lucide-react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { PracticeScreen } from "./PracticeTab/PracticeScreen";
import {
  useFonts,
  Lato_400Regular,
  Barlow_400Regular,
} from "@expo-google-fonts/dev";

const StyledText = styled.Text(({ theme }) => ({
  fontSize: theme.t6,
  color: theme.colors.text,
}));

export default function App() {
  const themeSetting = useLocalStorageStore((state) => state.theme);
  const toggleTheme = useLocalStorageStore((state) => state.toggleTheme);

  const isInDarkMode = themeSetting === "dark";
  const currentTheme = isInDarkMode ? darkTheme : lightTheme;

  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Barlow_400Regular,
  });

  const defaultText = {
    style: [{ fontFamily: "Lato_400Regular" }],
  };

  if (!fontsLoaded) {
    return null;
  }

  setDefaultProps(Text, defaultText);
  setDefaultProps(TextInput, defaultText);

  return (
    <ThemeProvider theme={currentTheme}>
      <View
        style={{
          backgroundColor: currentTheme.colors.background,
          flex: 1,
        }}
      >
        <SystemBars style={isInDarkMode ? "light" : "dark"} />
        <PracticeScreen />
        <Pressable
          hitSlop={15}
          onPress={toggleTheme}
          style={{ alignSelf: "center", paddingTop: 40 }}
        >
          <Star
            size={23}
            strokeWidth={1.1}
            color={currentTheme.colors.iconColor}
          />
        </Pressable>
      </View>
    </ThemeProvider>
  );
}

App.whyDidYouRender = true;
