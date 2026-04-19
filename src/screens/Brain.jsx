import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import FAB from "../components/FAB";
import API from "../services/api";

export default function Brain() {
  const [idea, setIdea] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

    useEffect(() => {
    fetchIdeas();
  }, []);


  // ✅ GET ALL IDEAS
  const fetchIdeas = async () => {
    try {
      const res = await API.get("/ideas");
      setIdeas(res.data.ideas);
    } catch (err) {
      console.log("FETCH ERROR:", err?.response?.data || err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // ✅ CREATE IDEA (POSTMAN MATCH)
  const handleAddIdea = async () => {
    if (!idea.trim()) {
      return Alert.alert("Error", "Enter idea first");
    }

    try {
      setLoading(true);

      await API.post("/ideas", {
        title: idea,
        description: idea,
        priority: "high",
        status: "active",
        tags: ["mobile", "ui"],
        category: "Product",
      });

      setIdea("");
      fetchIdeas(); // refresh list

    } catch (err) {
      console.log("ERROR:", err?.response?.data || err.message);
      Alert.alert("Error", "Failed to add idea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER (UNCHANGED UI) */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Brain</Text>
            <Text style={styles.subtitle}>
              A place to capture ideas, thoughts,{"\n"}
              and inspiration.
            </Text>
          </View>

          <View style={styles.iconRow}>
            <View style={styles.iconBox}>
              <Feather name="search" size={18} />
            </View>
            <View style={styles.iconBox}>
              <Feather name="more-vertical" size={18} />
            </View>
          </View>
        </View>

        {/* INPUT CARD (UI SAME, LOGIC ADDED) */}
        <View style={styles.card}>
          <TextInput
            placeholder="Capture an idea before it disappears..."
            placeholderTextColor="#8A7F7D"
            value={idea}
            onChangeText={setIdea}
            style={{ color: "#2E2626", marginBottom: 10 }}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddIdea}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="plus" size={16} color="#fff" />
                  <Text style={styles.addText}>Add Idea</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.voiceBtn}>
              <Feather name="mic" size={16} color="#F35539" />
              <Text style={styles.voiceText}>Voice Note</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FILTERS (UNCHANGED UI) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {["All", "Startup Ideas", "Product Ideas", "Strategies", "Random Thoughts", "Learning"].map((item, index) => (
              <View
                key={index}
                style={[
                  styles.filter,
                  index === 0 && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    index === 0 && styles.activeFilterText,
                  ]}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* SECTION */}
        <Text style={styles.section}>Recent Inspiration</Text>

        {/* ✅ DYNAMIC IDEAS */}
        {fetching ? (
          <ActivityIndicator size="large" />
        ) : (
          ideas.map((item) => (
            <View key={item._id} style={styles.ideaCard}>
              <Text style={styles.ideaTitle}>{item.title}</Text>

              <Text style={styles.ideaDesc}>
                {item.description}
              </Text>

              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.category}</Text>
                </View>

                <Text style={styles.link}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}

      </ScrollView>

      <FAB onPress={() => console.log("FAB Clicked")} />
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
    justifyContent: "space-between",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E2626",
  },

  subtitle: {
    fontSize: 14,
    color: "#8A7F7D",
    marginTop: 4,
  },

  iconRow: {
    flexDirection: "row",
    gap: 10,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  placeholder: {
    color: "#8A7F7D",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  addBtn: {
    flexDirection: "row",
    backgroundColor: "#F35539",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    gap: 5,
  },

  addText: {
    color: "#fff",
    fontWeight: "600",
  },

  voiceBtn: {
    flexDirection: "row",
    backgroundColor: "#FFF1EA",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    gap: 5,
  },

  voiceText: {
    color: "#F35539",
    fontWeight: "600",
  },

  filters: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },

  filter: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
  },

  activeFilter: {
    backgroundColor: "#F35539",
  },

  filterText: {
    color: "#2E2626",
  },

  activeFilterText: {
    color: "#fff",
  },

  section: {
    margin: 20,
    fontWeight: "600",
    color: "#8A7F7D",
  },

  ideaCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },

  ideaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2626",
  },

  ideaDesc: {
    marginTop: 8,
    color: "#8A7F7D",
  },

  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  tag: {
    backgroundColor: "#FFF1EA",
    padding: 6,
    borderRadius: 4,
  },

  tagText: {
    color: "#F35539",
    fontSize: 12,
  },

  link: {
    fontSize: 12,
    color: "#2E2626",
  },

});