import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import FAB from "../components/FAB";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);
  const [dreamCount, setDreamCount] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    avgProgress: 0,
  });

  // 🔹 Load user
  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    }
  };

  // 🔹 Auto refresh profile
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  // 🔹 Calculate stats
  const calculateStats = (dreams) => {
    const total = dreams.length;

    const completed = dreams.filter(
      (d) => d.status === "completed"
    ).length;

    const inProgress = dreams.filter(
      (d) => d.status === "in progress"
    ).length;

    const avgProgress =
      total > 0
        ? Math.round(
            dreams.reduce((sum, d) => sum + (d.progress || 0), 0) / total
          )
        : 0;

    setStats({ total, completed, inProgress, avgProgress });
  };

  // 🔹 Fetch dreams
  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const res = await axios.get(
          "https://creviced-nonmeditative-neymar.ngrok-free.dev/api/dreams"
        );

        calculateStats(res.data.dreams);
      } catch (err) {
        console.log("Dream API Error:", err);
      }
    };

    fetchDreams();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* PROFILE HEADER */}
        <View style={styles.header}>
          
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Image
              source={
                user?.image
                  ? { uri: user.image }
                  : require("../assets/images/image.jpg")
              }
              style={styles.avatar}
            />
          </TouchableOpacity>

          <Text style={styles.name}>
            {user?.name || "Guest User"}
          </Text>

          <Text style={styles.role}>
            {user?.phone || "No Phone"}
          </Text>

          <Text style={styles.quote}>
            "Building dreams one day at a time."
          </Text>
        </View>

        {/* 🔥 LIFE PROGRESS (REAL DATA) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Life Progress</Text>

          <View style={styles.grid}>
            
            <View style={styles.box}>
              <Text style={styles.number}>{stats.total}</Text>
              <Text style={styles.label}>Dreams Created</Text>
            </View>

            <View style={styles.box}>
              <Text style={styles.number}>{stats.inProgress}</Text>
              <Text style={styles.label}>In Progress</Text>
            </View>

            <View style={styles.box}>
              <Text style={styles.number}>{stats.completed}</Text>
              <Text style={styles.label}>Completed</Text>
            </View>

            <View style={styles.box}>
              <Text style={styles.number}>{stats.avgProgress}%</Text>
              <Text style={styles.label}>Avg Progress</Text>
            </View>

          </View>
        </View>

        {/* LIFE INSIGHTS */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Life Insights</Text>
          <Text style={styles.insightDesc}>
            Understand your productivity and progress.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Calendar")}
          >
            <Text style={styles.buttonText}>View Insights</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* FAB */}
      <FAB onPress={() => console.log("FAB Clicked")} />

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8 }}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EC",
  },

  header: {
    alignItems: "center",
    padding: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },

  role: {
    color: "#F35539",
    marginTop: 4,
  },

  quote: {
    fontSize: 12,
    color: "#8A7F7D",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 16,
    borderRadius: 16,
  },

  cardTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  box: {
    width: "48%",
    backgroundColor: "#FFF1EA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  number: {
    color: "#F35539",
    fontWeight: "700",
    fontSize: 18,
  },

  label: {
    fontSize: 12,
    color: "#8A7F7D",
    textAlign: "center",
  },

  insightCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFF1EA",
    borderWidth: 1,
    borderColor: "#F35539",
  },

  insightTitle: {
    color: "#F35539",
    fontWeight: "700",
  },

  insightDesc: {
    marginTop: 6,
    fontSize: 13,
    color: "#8A7F7D",
  },

  button: {
    marginTop: 12,
    backgroundColor: "#F35539",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  logout: {
    backgroundColor: "#F35539",
    margin: 20,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
});