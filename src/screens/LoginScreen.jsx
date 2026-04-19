import React, { useState, useEffect } from "react";
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
} from "react-native";

import SocialButton from "../components/SocialButton";
import Feather from "@react-native-vector-icons/feather";

import { loginUser } from "../services/auth";
import API from "../services/api"; // ✅ FIXED
import { setToken, setUser, getToken } from "../utils/storage";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

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

  // ✅ GOOGLE CONFIG
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "607625402166-bjpp6kvidmbnvl0554r3doijv4481t4n.apps.googleusercontent.com",
    });
  }, []);

  // ================= EMAIL LOGIN =================
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please enter email and password");
    }

    try {
      const res = await loginUser({ email, password });

      if (res.data.success) {
        await setToken(res.data.token);
        await setUser(res.data.user);

        const token = await getToken();
        console.log("TOKEN SAVED:", token);

        navigation.replace("Journey");
      } else {
        Alert.alert("Login Failed", res.data.message);
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      Alert.alert("Error", "Invalid credentials or server error");
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.log("GOOGLE USER:", userInfo);

      const email = userInfo.user.email;
      const name = userInfo.user.name;

      const fixedPassword = "google@123";

      try {
        // 👉 TRY LOGIN FIRST
        const res = await loginUser({
          email,
          password: fixedPassword,
        });

        if (res.data.success) {
          await setToken(res.data.token);
          await setUser(res.data.user);

          console.log("GOOGLE LOGIN SUCCESS");

          navigation.replace("Journey");
          return;
        } else {
          throw new Error("Login failed");
        }
      } catch (loginError) {
        console.log("Login failed → trying signup");

        // 👉 SIGNUP
        const signupRes = await API.post("/auth/signup", {
          name,
          email,
          username: name,
          password: fixedPassword,
          phoneNumber: "0000000000",
          dob: "2000-01-01",
        });

        if (signupRes.data.success) {
          await setToken(signupRes.data.token);
          await setUser(signupRes.data.user);

          console.log("GOOGLE SIGNUP SUCCESS");

          navigation.replace("Journey");
        } else {
          Alert.alert("Signup Failed");
        }
      }
    } catch (error) {
      console.log("Google Error:", error);
      Alert.alert("Google Login Failed");
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

            {/* GOOGLE BUTTON */}
            <View style={styles.socialContainer}>
              <SocialButton
                icon="chrome"
                text="Continue with Google"
                onPress={handleGoogleLogin}
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