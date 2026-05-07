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
      try {
        console.log("SPLASH START");

        const token = await getToken();

        console.log("TOKEN:", token);

        setTimeout(async () => {
          if (!mounted) return;

          console.log("NAVIGATING...");

          await RNBootSplash.hide({ fade: true });

          navigation.replace("Onboarding1");
        }, 3000);
      } catch (error) {
        console.log("SPLASH ERROR:", error);
      }
    };

    init();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* CENTER */}
      <View style={styles.center}>
        <Text style={styles.title}>DO-OD</Text>

        <Text style={styles.tagline}>
          Day One to One Day
        </Text>
      </View>

      {/* BOTTOM */}
      <View style={styles.bottom}>

        {/* 🔥 PROGRESS BAR */}
        <View style={styles.progressBox}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          >
            {/* STRIPES */}
            <View style={styles.stripeContainer}>
              {Array.from({ length: 20 }).map((_, index) => (
                <View key={index} style={styles.stripe} />
              ))}
            </View>

            {/* % INSIDE BAR */}
            <Text style={styles.progressText}>
              {progress}%
            </Text>
          </View>
        </View>

        {/* POWERED */}
        <Text style={styles.powered}>
          Powered By
        </Text>

        <Text style={styles.jarvis}>
          JARVIS
        </Text>
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

  /* CENTER */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* TITLE */
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#F2553A",
    letterSpacing: 1,
  },

  /* TAGLINE */
  tagline: {
    fontSize: 17,
    color: "#8A7A74",
    marginTop: 8,
    fontWeight: "500",
  },

  /* BOTTOM */
  bottom: {
    alignItems: "center",
    marginBottom: 20,
  },

  /* PROGRESS BAR */
  progressBox: {
    width: 260,
    height: 30,
    backgroundColor: "#FFF5EC",
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFD6C7",
    marginBottom: 30,
    justifyContent: "center",
  },

  /* FILL */
  progressFill: {
    height: "100%",
    backgroundColor: "#F2553A",
    borderRadius: 40,
    borderColor: "#E5E5E5",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  /* STRIPES */
  stripeContainer: {
    flexDirection: "row",
    position: "absolute",
    left: -20,
  },

  stripe: {
    width: 18,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginRight: 10,
    transform: [{ rotate: "35deg" }],
  },

  /* % INSIDE BAR */
  progressText: {
    position: "absolute",
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },

  /* POWERED */
  powered: {
    fontSize: 18,
    color: "#222",
    marginBottom: 4,
    fontWeight: "500",
  },

  /* JARVIS */
  jarvis: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
});