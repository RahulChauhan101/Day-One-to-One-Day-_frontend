import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNBootSplash from "react-native-bootsplash";
import { getToken } from "../utils/storage";

export default function SplashScreen({ navigation }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;

    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

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
      {/* Center Content */}
      <View style={styles.center}>
        <Text style={styles.title}>DO-OD</Text>
        <Text style={styles.tagline}>Day One to One Day</Text>

        <View style={styles.progressBox}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.percent}>{progress}%</Text>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <Text style={styles.powered}>Powered By</Text>
        <Text style={styles.jarvis}>JARVIS</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EC",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // 🔥 DO-OD (Figma exact)
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F2553A",
  },

  // 🔥 tagline
  tagline: {
    fontSize: 16,
    color: "#8A7A74",
    marginTop: 5,
    marginBottom: 25,
  },

  // 🔥 Progress bar (light white)
  progressBox: {
    width: 200,
    height: 6,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#F2553A",
  },

  percent: {
    marginTop: 10,
    color: "#8A7A74",
    fontWeight: "600",
  },

  // 🔥 Bottom text
  bottom: {
    alignItems: "center",
  },

  powered: {
    fontSize: 16,
    color: "#000",
  },

  jarvis: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
});