import { RefreshCcw } from "lucide-react-native";
import { Pressable } from "react-native";

export const SettingsScreen = () => {
  return (
    <View
      style={
        {
          // flex: 1,
        }
      }
    >
      <Pressable hitSlop={15} onPress={null}>
        <RefreshCcw
          size={23}
          strokeWidth={1.1}
          color={currentTheme.colors.iconColor}
        />
      </Pressable>
    </View>
  );
};
