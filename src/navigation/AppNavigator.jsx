import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen1 from "../screens/OnboardingScreen1";
import OnboardingScreen2 from "../screens/OnboardingScreen2";
import OnboardingScreen3 from "../screens/OnboardingScreen3";


import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

import JourneyScreen from "../screens/JourneyScreen";
import NextScreen from "../screens/NextScreen";
import Goal_Screen from "../screens/Goal_Screen";

import MainTabNavigator from "./MainTabNavigator";
import { getToken } from "../utils/storage";

import { COLORS } from "../theme/colors";
import EditProfile from "../screens/EditProfile";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await getToken();

    if (token) {
      setIsAuth(true);
    }

    setLoading(false);
  };

  // ⏳ loading state
  if (loading) return null;

  return (
    <Stack.Navigator
      initialRouteName={isAuth ? "MainApp" : "Onboarding1"}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      
      {/* ONBOARDING */}
      <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
      <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />

      {/* AUTH */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* FLOW */}
      <Stack.Screen name="Journey" component={JourneyScreen} />
      <Stack.Screen name="Next" component={NextScreen} />
      <Stack.Screen name="Goal" component={Goal_Screen} />

      <Stack.Screen name="EditProfile" component={EditProfile} />

      {/* MAIN APP */}
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}