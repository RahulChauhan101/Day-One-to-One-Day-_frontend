import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import API from "../../services/api";

export default function IdeaScreen({ navigation }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Product");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ CREATE IDEA
  const handleCreateIdea = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter title");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        description,
        priority,
        status: "active",
        category,
        tags: tags.split(",").map(t => t.trim()), // 🔥 convert to array
      };

      const res = await API.post("/ideas", payload);

      console.log("IDEA CREATED:", res.data);

      Alert.alert("Success", "Idea created");

      navigation.goBack();

    } catch (err) {
      console.log("IDEA ERROR:", err?.response?.data);
      Alert.alert("Error", "Failed to create idea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Idea</Text>

          <View style={{ width: 22 }} />
        </View>

        {/* FORM */}
        <View style={styles.form}>

          {/* TITLE */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Mobile app redesign"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          {/* DESCRIPTION */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Describe your idea..."
            style={[styles.input, { height: 100 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* PRIORITY */}
          <Text style={styles.label}>Priority</Text>
          <View style={styles.row}>
            {["low", "medium", "high"].map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.chip,
                  priority === p && styles.chipActive
                ]}
              >
                <Text style={[
                  styles.chipText,
                  priority === p && styles.chipTextActive
                ]}>
                  {p.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CATEGORY */}
          <Text style={styles.label}>Category</Text>
          <TextInput
            placeholder="Product / Business / App"
            style={styles.input}
            value={category}
            onChangeText={setCategory}
          />

          {/* TAGS */}
          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            placeholder="UI, UX, redesign"
            style={styles.input}
            value={tags}
            onChangeText={setTags}
          />

        </View>

        {/* BUTTON */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateIdea}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating..." : "Create Idea"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}  const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5EC" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  headerTitle: { fontSize: 18, fontWeight: "700" },

  form: { padding: 20 },

  label: { fontWeight: "600", marginBottom: 6 },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  chip: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },

  chipActive: {
    backgroundColor: "#F35539",
  },

  chipText: {
    color: "#333",
  },

  chipTextActive: {
    color: "#fff",
  },

  footer: { padding: 20 },

  button: {
    backgroundColor: "#F35539",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});