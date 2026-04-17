import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
  Linking,
} from "react-native";

import SocialButton from "../components/SocialButton";
import Feather from "@react-native-vector-icons/feather";
import { loginUser } from "../services/auth";
import { setToken, setUser } from "../utils/storage";
import { getToken } from "../utils/storage";

const COLORS = {
  primary: "#F35539",
  background: "#FFF5EC",
  textDark: "#2E2626",
  textLight: "#8A7A74",
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ LOGIN FUNCTION
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please enter email and password");
    }

    try {
      console.log("Sending:", { email, password });

      const res = await loginUser({ email, password });

      console.log("Response:", res.data);

      if (res.data.success) {
        // ✅ SAVE TOKEN
        await setToken(res.data.token);

        // ✅ SAVE USER
        await setUser(res.data.user);

            const token = await getToken();
    console.log("CHECK TOKEN:", token);


        console.log("TOKEN SAVED:", res.data.token);



        // ✅ NAVIGATE
        navigation.replace("MainApp");
      } else {
        Alert.alert("Login Failed", res.data.message);
      }
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data || err.message);

      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.topSection}>
          <Image
            source={require("../assets/DoodLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>DO-OD</Text>
          <Text style={styles.tagline}>Day One to One Day</Text>
        </View>

        {/* FORM */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Stay consistent. Your goals are waiting.
            </Text>

            <View style={styles.card}>
              {/* EMAIL */}
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color={COLORS.textLight} />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>

              {/* PASSWORD */}
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color={COLORS.textLight} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>

              {/* LOGIN BUTTON */}
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <Text style={styles.forgot}>Forgot Password?</Text>
            </View>

            {/* DIVIDER */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.or}>or continue with</Text>
              <View style={styles.line} />
            </View>

            {/* SOCIAL LOGIN */}
            <View style={styles.socialContainer}>
              <SocialButton
                icon="chrome"
                text="Continue with Google"
                onPress={() =>
                  Linking.openURL("https://accounts.google.com/signin")
                }
              />

              <SocialButton
                icon="apple"
                text="Continue with Apple"
                onPress={() =>
                  Linking.openURL("https://appleid.apple.com")
                }
              />
            </View>

            {/* SIGNUP */}
            <Text style={styles.signup}>
              Don't have an account?{" "}
              <Text
                style={{ color: COLORS.primary, fontWeight: "600" }}
                onPress={() => navigation.navigate("Signup")}
              >
                Create Account
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  topSection: {
    width: "100%",
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: { width: 130, height: 130 },

  appName: { fontSize: 30, fontWeight: "700", color: "#F2553A" },

  tagline: { fontSize: 14, color: "#8A7A74" },

  formContainer: { paddingHorizontal: 20 },

  title: { fontSize: 26, fontWeight: "700", color: COLORS.textDark },

  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    elevation: 5,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },

  input: { flex: 1, fontSize: 14, color: COLORS.textDark },

  button: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  forgot: {
    textAlign: "center",
    color: COLORS.primary,
    fontSize: 14,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  or: {
    marginHorizontal: 10,
    fontSize: 12,
    color: COLORS.textLight,
  },

  socialContainer: { gap: 10 },

  signup: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 14,
    color: COLORS.textDark,
  },
});