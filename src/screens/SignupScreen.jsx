import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@react-native-vector-icons/feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signupUser } from "../services/auth";
import { setToken } from "../utils/storage";

const COLORS = {
  primary: "#F35539",
  background: "#FFF5EC",
  textDark: "#2E2626",
  textLight: "#8A7A74",
};

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // ✅ Google Config
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "YOUR_WEB_CLIENT_ID", // 🔥 Firebase se lena
    });
  }, []);

  // ✅ Normal Signup
const handleSignup = async () => {
  if (!name || !email || !password || !confirm) {
    Alert.alert("Error", "Please fill all fields");
    return;
  }

  if (password !== confirm) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }

  try {
    const res = await signupUser({
      name,
      email,
      username: email,
      password,
      phoneNumber: "9999999999",
      dob: "2000-01-01",
    });

    if (res.data.success) {
      // 🔥 Token save
      await AsyncStorage.setItem("token", res.data.token);

      // 🔥 User save (important)
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));      Alert.alert("Success", "Account Created ✅");

      navigation.replace("MainApp");
    }

  }catch (error) {

    // 🔥 ADD THIS HERE 👇
    console.log("FULL ERROR:", error);
    console.log("BACKEND ERROR:", error.response?.data);

    Alert.alert(
      "Error",
      JSON.stringify(error.response?.data || error.message)
    );
  }
};

  // 🔥 GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.user;

      console.log("Google User:", user);

      // Backend call
      const res = await signupUser({
        name: user.name,
        email: user.email,
        username: user.email,
        password: "google_auth",
        phoneNumber: "9999999999",
        dob: "2000-01-01",
      });

      if (res.data.success) {
        Alert.alert("Google Signup Success ✅");
        navigation.replace("MainApp");
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Google Login Failed ❌");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Start building powerful habits and track your progress every day.
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputBox}>
            <Feather name="user" size={20} color="#A1A1AA" />
            <TextInput
              placeholder="Enter your full name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputBox}>
            <Feather name="mail" size={20} color="#A1A1AA" />
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Feather name="lock" size={20} color="#A1A1AA" />
            <TextInput
              placeholder="Create a password"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputBox}>
            <Feather name="lock" size={20} color="#A1A1AA" />
            <TextInput
              placeholder="Confirm password"
              secureTextEntry
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* 🔥 SOCIAL */}
        <View style={styles.socialRow}>
          
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={handleGoogleSignup}
          >
            <FontAwesome5 name="google" size={18} />
            <Text>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => Alert.alert("Coming Soon")}
          >
            <FontAwesome5 name="apple" size={20} />
            <Text>Apple</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text onPress={() => navigation.navigate("Login")}>
            Login
          </Text>
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: { padding: 24 },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { color: COLORS.textLight },

  form: { padding: 24, gap: 15 },

  label: { fontWeight: "600" },

  inputBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 10,
  },

  input: { flex: 1 },

  button: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "700" },

  socialRow: {
    flexDirection: "row",
    gap: 10,
    padding: 20,
  },

  socialBtn: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  loginText: { textAlign: "center", marginTop: 20 },
});