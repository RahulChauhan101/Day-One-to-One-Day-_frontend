import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import API from "../../services/api";

export default function TaskScreen({ navigation, route }) {
  const { dreamId } = route.params || {}; // 🔥 goal से आया ID

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  // ✅ CREATE TASK
  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter task title");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        description,
        priority,
        dueDate: new Date().toISOString(),
        dreamId: dreamId || null, // 🔥 attach dream
      };

      const res = await API.post("/tasks", payload);

      console.log("TASK CREATED:", res.data);

      Alert.alert("Success", "Task created successfully");

      navigation.goBack();

    } catch (err) {
      console.log("TASK ERROR:", err?.response?.data);
      Alert.alert("Error", "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color="#2E2626" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Task</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* FORM */}
      <View style={styles.form}>

        {/* TITLE */}
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          placeholder="e.g. Complete React project"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        {/* DESCRIPTION */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Add details..."
          style={[styles.input, { height: 100 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* PRIORITY */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.row}>
          {["low", "medium", "high"].map((item) => {
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
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </View>

      {/* BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            (!title || loading) && { opacity: 0.6 },
          ]}
          onPress={handleCreateTask}
          disabled={!title || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Create Task"}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EC",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  form: {
    padding: 20,
    gap: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2626",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  priorityBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },

  priorityActive: {
    backgroundColor: "#FFD6C7",
    borderColor: "#F35539",
  },

  priorityText: {
    color: "#7A6E6C",
    fontWeight: "600",
  },

  priorityTextActive: {
    color: "#F35539",
  },

  footer: {
    padding: 20,
  },

  button: {
    backgroundColor: "#F35539",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});