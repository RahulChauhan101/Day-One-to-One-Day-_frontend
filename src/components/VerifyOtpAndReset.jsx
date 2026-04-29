import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import API from "../services/api";

const COLORS = {
  primary: "#F35539",
  background: "#FFF5EC",
  textDark: "#2E2626",
  textLight: "#8A7A74",
};

export default function VerifyOtpAndReset({ route, navigation }) {
  const { email } = route.params;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!otp || !newPassword) {
      return Alert.alert("Error", "Enter OTP and new password");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-otp-and-reset", {
        email,
        otp,
        newPassword,
      });

      if (res.data.success) {
        Alert.alert("Success", "Password reset successful");

        // 👉 Login screen pe bhejo
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", res.data.message);
      }
    } catch (err) {
      console.log("RESET ERROR:", err);
      Alert.alert("Error", "Invalid OTP or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>{email}</Text>

        {/* OTP INPUT */}
        <TextInput
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          keyboardType="number-pad"
        />

        {/* NEW PASSWORD */}
        <TextInput
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          secureTextEntry
        />

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>
            {loading ? "Processing..." : "Reset Password"}
          </Text>
        </TouchableOpacity>

        {/* BACK */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  button: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  back: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.primary,
  },
});