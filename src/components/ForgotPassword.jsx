import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import API from "../services/api";

const COLORS = {
  primary: "#F35539",
  background: "#FFF5EC",
  textDark: "#2E2626",
  textLight: "#8A7A74",
};

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      return Alert.alert("Error", "Enter email");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", { email });

      if (res.data.success) {
        Alert.alert("Success", res.data.message);
        navigation.navigate("VerifyOtpAndReset", { email });
      }
    } catch (err) {
      console.log("ERROR:", err?.response?.data || err.message);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔥 TOP LOGO */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/DoodLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>DO-OD</Text>
      </View>

      {/* 🔥 FORM CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email to receive OTP
        </Text>

        {/* EMAIL */}
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={20} color={COLORS.textLight} />
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send OTP"}
          </Text>
        </TouchableOpacity>

        {/* BACK */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* 🔥 TOP */
  topSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 150,
  },

  logo: {
    width: 120,
    height: 120,
  },

  appName: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 5,
  },

  /* 🔥 CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textDark,
  },

  button: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  back: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.primary,
    fontSize: 14,
  },
});