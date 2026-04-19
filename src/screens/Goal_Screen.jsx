import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import API from "../services/api";

export default function Goal_Screen({ navigation }) {
  // ✅ ALL HOOKS AT TOP (NO CONDITION)
  const [goal, setGoal] = useState("");
  const [priority, setPriority] = useState("High");
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeline, setTimeline] = useState("1 - 3 Years");
  const [loading, setLoading] = useState(false);

  // ✅ stable function (optional but safe)
  const getTargetDate = useCallback(() => {
    if (timeline === "1 - 3 Years") return "2027-01-01";
    if (timeline === "3 - 5 Years") return "2029-01-01";
    return "2032-01-01";
  }, [timeline]);

  // ✅ API CALL
 const handleCreateDream = async () => {
  try {
    const res = await API.post("/dreams", {
      title: goal,
      subTitle: "My Goal",
      description: goal,
      image: "https://example.com/image.jpg",
      priority: priority.toLowerCase(),
      type: "work", // ✅ change
      status: "in progress",
      targetDate: new Date(getTargetDate()).toISOString(), // ✅ FIX
      progress: 0,
    });

    console.log("SUCCESS:", res.data);

    navigation.replace("MainApp");

  } catch (err) {
    console.log("FULL ERROR:", err?.response?.data); // 👈 IMPORTANT
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="#2E2626" />
            </TouchableOpacity>

            <Text style={styles.progress}>STEP 3 OF 6</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* IMAGE */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/Background_Shadow.png")}
            style={styles.image}
          />
        </View>

        {/* MAIN */}
        <View style={styles.main}>
          <Text style={styles.title}>
            What is your biggest{"\n"}dream right now?
          </Text>

          {/* GOAL */}
          <View style={styles.block}>
            <Text style={styles.label}>Your Primary Goal</Text>

            <View style={styles.inputBox}>
              <Feather name="target" size={18} color="#7A6E6C" />
              <TextInput
                placeholder="e.g., Build my own startup"
                placeholderTextColor="#7A6E6C"
                style={styles.input}
                value={goal}
                onChangeText={setGoal}
              />
            </View>
          </View>

          {/* TIMELINE */}
          <View style={styles.block}>
            <Text style={styles.label}>Target Timeline</Text>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowDropdown((p) => !p)}
            >
              <Text style={{ color: "#2E2626" }}>{timeline}</Text>
              <Feather
                name="chevron-down"
                size={18}
                color="#7A6E6C"
                style={{
                  transform: [{ rotate: showDropdown ? "180deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdown}>
                {["1 - 3 Years", "3 - 5 Years", "5+ Years"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTimeline(item);
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* PRIORITY */}
          <View style={styles.block}>
            <Text style={styles.label}>Priority Level</Text>

            <View style={styles.row}>
              {["High", "Medium", "Low"].map((item) => {
                const active = priority === item;

                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setPriority(item)}
                    style={[
                      styles.priorityBtn,
                      active && styles.priorityActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        active && styles.priorityTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateDream}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5EC" },

  header: { padding: 20 },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  progress: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7A6E6C",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#F6EDE8",
    borderRadius: 12,
    marginTop: 12,
  },

  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#F35539",
    borderRadius: 12,
  },

  imageContainer: { paddingHorizontal: 20, marginTop: 10 },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    resizeMode: "cover",
  },

  main: { padding: 20, gap: 20 },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E2626",
  },

  block: { marginTop: 10 },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2E2626",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },

  input: { flex: 1, marginLeft: 10, color: "#2E2626" },

  row: { flexDirection: "row", gap: 12 },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },

  dropdownText: { color: "#2E2626" },

  priorityBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
  },

  priorityActive: {
    backgroundColor: "#FFD6C7",
    borderColor: "#F35539",
  },

  priorityText: {
    color: "#7A6E6C",
    fontWeight: "600",
  },

  priorityTextActive: { color: "#F35539" },

  footer: { padding: 20 },

  button: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F35539",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});