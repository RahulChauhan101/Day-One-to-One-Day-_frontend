import React from "react";
import { useEffect, useState } from "react";
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

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);
useEffect(() => {
  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");
    console.log("USER:", data); // 👈 check

    if (data) {
      setUser(JSON.parse(data));
    }
  };

  loadUser();
}, []);

  const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem("token"); // 👈 token delete
     await AsyncStorage.removeItem("user"); // 🔥 add this
    navigation.replace("Login"); // 👈 login screen pe bhejo
  } catch (error) {
    console.log("Logout Error:", error);
  }
};
  return (
    
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* PROFILE HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/image.jpg")} // 👈 apna image add karo
            style={styles.avatar}
          />

<Text style={styles.name}>
  {user?.name || "Guest User"}
</Text>

<Text style={styles.role}>
  {user?.email || "No Email"}
</Text>
          <Text style={styles.quote}>
            "Building dreams one day at a time."
          </Text>
        </View>

        {/* LIFE PROGRESS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Life Progress</Text>

          <View style={styles.grid}>
            <View style={styles.box}>
              <Text style={styles.number}>5</Text>
              <Text style={styles.label}>Dreams Created</Text>
            </View>

            <View style={styles.box}>
              <Text style={styles.number}>18</Text>
              <Text style={styles.label}>Actions Completed</Text>
            </View>

            <View style={styles.box}>
              <Text style={styles.number}>214</Text>
              <Text style={styles.label}>Tasks Completed</Text>
            </View>

            <View style={styles.box}>
              <Text style={styles.number}>12</Text>
              <Text style={styles.label}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* LIFE INSIGHTS BUTTON */}
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

        {/* SETTINGS */}
<View style={styles.settingsCard}>

  {/* ROW 1 */}
  <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
    <View style={styles.iconBox}>
      <Feather name="clock" size={16} color="#F35539" />
    </View>

    <Text style={styles.settingText}>Daily Reminder Time</Text>

    <Feather name="chevron-right" size={18} color="#8A7F7D" />
  </TouchableOpacity>

  <View style={styles.divider} />

  {/* ROW 2 */}
  <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
    <View style={styles.iconBox}>
      <Feather name="zap" size={16} color="#F35539" />
    </View>

    <Text style={styles.settingText}>Energy Check-in Reminder</Text>

    <Feather name="chevron-right" size={18} color="#8A7F7D" />
  </TouchableOpacity>

  <View style={styles.divider} />

  {/* ROW 3 */}
  <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
    <View style={styles.iconBox}>
      <Feather name="bell" size={16} color="#F35539" />
    </View>

    <Text style={styles.settingText}>Notification Settings</Text>

    <Feather name="chevron-right" size={18} color="#8A7F7D" />
  </TouchableOpacity>

</View>

      </ScrollView>
            {/* FAB */}
<FAB onPress={() => console.log("FAB Clicked")} />

  {/* LOGOUT */}
<View style={styles.divider} />

<TouchableOpacity
  style={styles.settingRow}
  activeOpacity={0.7}
  onPress={handleLogout}
>
  <View style={styles.iconBox}>
    <Feather name="log-out" size={16} color="#F35539" />
  </View>

  <Text style={styles.settingText}>Logout</Text>

  <Feather name="chevron-right" size={18} color="#8A7F7D" />
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
settingsCard: {
  backgroundColor: "#fff",
  margin: 20,
  borderRadius: 16,
  paddingHorizontal: 16,
},

settingRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 16,
},

iconBox: {
  width: 34,
  height: 34,
  borderRadius: 10,
  backgroundColor: "#FFF1EA",
  justifyContent: "center",
  alignItems: "center",
},

settingText: {
  flex: 1,
  marginLeft: 12,
  fontSize: 14,
  color: "#2E2626",
},

divider: {
  height: 1,
  backgroundColor: "#F1ECE9",
  marginLeft: 46, // 👈 align after icon
},

});