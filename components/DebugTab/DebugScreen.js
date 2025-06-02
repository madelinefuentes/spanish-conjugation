import { Pressable, View } from "react-native";
import { Bean, Bubbles, Star } from "lucide-react-native";
import { seedVerbs } from "../db/seedVerbs";
import { clearDatabase } from "../db/client";
import { useLocalStorageStore } from "../stores/LocalStorageStore";
import { useTheme } from "@emotion/react";

export const DebugScreen = () => {
  const toggleTheme = useLocalStorageStore((state) => state.toggleTheme);
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        gap: 80,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable hitSlop={15} onPress={toggleTheme}>
        <Star size={23} color={theme.colors.iconColor} />
      </Pressable>
      <Pressable hitSlop={15} onPress={seedVerbs}>
        <Bean size={23} color={theme.colors.iconColor} />
      </Pressable>
      <Pressable hitSlop={15} onPress={clearDatabase}>
        <Bubbles size={23} color={theme.colors.iconColor} />
      </Pressable>
    </View>
  );
};
