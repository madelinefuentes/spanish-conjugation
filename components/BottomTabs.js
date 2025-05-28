import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { responsiveScale } from "./util/ResponsiveScale";
import { PracticeScreen } from "./PracticeTab/PracticeScreen";
import { SettingsScreen } from "./SettingsTab/SettingsScreen";
import { useTheme } from "@emotion/react";
import { Dumbbell } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      // initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: responsiveScale(50),
          paddingLeft: responsiveScale(18),
          paddingRight: responsiveScale(18),
          paddingTop: responsiveScale(4),
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="practice"
        component={PracticeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Dumbbell
              size={theme.t7}
              color={
                focused ? theme.colors.primary : theme.colors.greyClickable
              }
            />
          ),
        }}
      />
      {/* <Tab.Screen
          name="settings"
          component={SettingsScreen}
          options={screenOptions.tasks}
        /> */}
    </Tab.Navigator>
  );
};
