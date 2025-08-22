import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { responsiveScale } from "./util/ResponsiveScale";
import { PracticeScreen } from "./PracticeTab/PracticeScreen";
import { DebugScreen } from "./DebugTab/DebugScreen";
import { useTheme } from "@emotion/react";
import {
  Dumbbell,
  SquareTerminal,
  BookText,
  ChartColumn,
} from "lucide-react-native";
import { Pressable } from "react-native";
import { VerbListScreen } from "./VerbListTab/VerbListScreen";
import { ProgressScreen } from "./ProgressTab/ProgressScreen";

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
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: "transparent" }}
            hitSlop={20}
          />
        ),
      }}
    >
      <Tab.Screen
        name="practice"
        component={PracticeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Dumbbell
              size={theme.t10}
              color={
                focused ? theme.colors.primary : theme.colors.greyClickable
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <ChartColumn
              size={theme.t10}
              color={
                focused ? theme.colors.primary : theme.colors.greyClickable
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="verbList"
        component={VerbListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <BookText
              size={theme.t10}
              color={
                focused ? theme.colors.primary : theme.colors.greyClickable
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="debug"
        component={DebugScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <SquareTerminal
              size={theme.t10}
              color={
                focused ? theme.colors.primary : theme.colors.greyClickable
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

BottomTabs.whyDidYouRender = true;
