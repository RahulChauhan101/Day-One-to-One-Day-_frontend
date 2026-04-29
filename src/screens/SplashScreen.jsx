import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNBootSplash from "react-native-bootsplash";
import { getToken } from "../utils/storage";

export default function SplashScreen({ navigation }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;

    // 🔄 fake progress animation
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100); // speed control

    const init = async () => {
      const token = await getToken();

      setTimeout(async () => {
        if (!mounted) return;

        await RNBootSplash.hide({ fade: true });

        navigation.replace(token ? "MainApp" : "Onboarding1");
      }, 3000);
    };

    init();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>DO-OD</Text>
        <Text style={styles.tagline}>Day One to One Day</Text>

        {/* 🔥 Progress UI */}
        <View style={styles.progressBox}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.percent}>{progress}%</Text>
      </View>

      <View style={styles.bottom}>
        <Text>Powered By</Text>
        <Text style={{ fontWeight: "700" }}>JARVIS</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d47420",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },

  tagline: {
    fontSize: 16,
    color: "#f5f5f5",
    marginBottom: 20,
  },

  progressBox: {
    width: 200,
    height: 6,
    backgroundColor: "#ffffff30",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },

  percent: {
    marginTop: 10,
    color: "#fff",
    fontWeight: "600",
  },

  bottom: {
    alignItems: "center",
  },
});