import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen1 from '../screens/OnboardingScreen1';
import OnboardingScreen2 from '../screens/OnboardingScreen2';
import OnboardingScreen3 from '../screens/OnboardingScreen3';

import ForgotPassword from '../components/ForgotPassword';
import VerifyOtpAndReset from '../components/VerifyOtpAndReset';

import SplashScreen from '../screens/SplashScreen';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 🔥 SPLASH FIRST */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* ONBOARDING */}
      <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
      <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />

      {/* AUTH */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyOtpAndReset" component={VerifyOtpAndReset} />

      {/* MAIN */}
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}