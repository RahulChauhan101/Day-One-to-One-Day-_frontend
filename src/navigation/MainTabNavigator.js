import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import Feather from "@react-native-vector-icons/feather";

import HomeScreen from "../screens/HomeScreen";
import Dream from "../screens/Dream";
import Calendar from "../screens/Calendar";
import Brain from "../screens/Brain";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          marginBottom: 10,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "rgba(0,0,0,0.08)",
        },

        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: focused ? "#F35539" : "#8A7B78",
              marginTop: 4,
            }}
          >
            {route.name}
          </Text>
        ),

        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === "Home") icon = "home";
          else if (route.name === "Dreams") icon = "target";
          else if (route.name === "Brain") icon = "cpu";
          else if (route.name === "Calendar") icon = "calendar";
          else if (route.name === "Profile") icon = "user";

          return (
            <Feather
              name={icon}
              size={22}
              color={focused ? "#F35539" : "#8A7B78"}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dreams" component={Dream} />
      <Tab.Screen name="Brain" component={Brain} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}