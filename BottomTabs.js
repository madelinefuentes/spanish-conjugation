import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { responsiveScale } from "./util/ResponsiveScale";

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
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
      {/* <Tab.Screen
          name="calendar"
          component={CalendarScreen}
          options={screenOptions.calendar}
        />
        <Tab.Screen
          name="tasks"
          component={TaskScreen}
          options={screenOptions.tasks}
        /> */}
    </Tab.Navigator>
  );
};
