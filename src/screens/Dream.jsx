import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import FAB from "../components/FAB";
import API from "../services/api";

export default function Dreams() {
const [dreams, setDreams] = useState([]);
const [filter, setFilter] = useState("All Dreams");
const [search, setSearch] = useState("");
const [showInput, setShowInput] = useState(false);
const [newDream, setNewDream] = useState("");

  // ✅ FETCH DREAMS
  const getDreams = async () => {
    try {
      const res = await API.get("/dreams");
      setDreams(res.data.dreams || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getDreams();
  }, []);

  // ✅ FILTER + SEARCH
  const filteredDreams = dreams.filter((item) => {
    const matchFilter =
      filter === "All Dreams"
        ? true
        : filter === "Active"
        ? item.status === "in progress"
        : item.progress === 100 || item.status === "boosted";

    const matchSearch =
      (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.subTitle || "").toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  // ✅ ADD DREAM (FIXED)
  const handleAddDream = async () => {
    if (!newDream.trim()) {
      return Alert.alert("Enter dream name");
    }

    try {
      const res = await API.post("/dreams", {
        title: newDream,
        subTitle: newDream,
        description: newDream,
        type: "work",
        priority: "high",
      });

      const added = res.data?.dream;

      if (added) {
        setDreams((prev) => [added, ...prev]);
        setNewDream("");
        setShowInput(false);
        Alert.alert("Success", "Dream added 🚀");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert("Error", "Failed to add dream");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>My Dreams</Text>
          <Text style={styles.subtitle}>Your big goals 🚀</Text>
        </View>

        {/* 🔍 SEARCH */}
        <View style={styles.searchInput}>
          <Feather name="search" size={16} />
          <TextInput
            placeholder="Search dreams..."
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        {/* 🔥 FILTER */}
        <View style={styles.filterRow}>
          {["All Dreams", "Active", "Completed"].map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setFilter(item)}
              style={[
                styles.filter,
                filter === item && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ➕ ADD INPUT (NEW) */}
        {showInput && (
          <View style={styles.addBox}>
            <TextInput
              placeholder="Enter new dream..."
              value={newDream}
              onChangeText={setNewDream}
              style={styles.input}
            />

            <TouchableOpacity style={styles.addBtn} onPress={handleAddDream}>
              <Text style={styles.addBtnText}>Add Dream</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 📋 LIST */}
        {filteredDreams.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No dreams found
          </Text>
        ) : (
          filteredDreams.map((item) => (
            <View key={item._id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.subTitle}>{item.subTitle}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>

              <Text style={styles.meta}>Status: {item.status}</Text>
              <Text style={styles.meta}>Progress: {item.progress}%</Text>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.progress || 0}%` },
                  ]}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ➕ FAB */}
      <FAB onPress={() => setShowInput(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF4EC",
  },

  header: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
  },

  searchInput: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },

  filter: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },

  activeFilter: {
    backgroundColor: "#F35539",
  },

  filterText: {
    color: "#000",
  },

  activeFilterText: {
    color: "#fff",
  },

  addBox: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 8,
  },

  addBtn: {
    marginTop: 10,
    backgroundColor: "#F35539",
    padding: 10,
    borderRadius: 8,
  },

  addBtnText: {
    color: "#fff",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  subTitle: {
    fontSize: 12,
    color: "#F35539",
  },

  cardDesc: {
    fontSize: 13,
    marginTop: 5,
  },

  meta: {
    fontSize: 12,
    marginTop: 4,
  },

  progressBar: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginTop: 8,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#F35539",
    borderRadius: 10,
  },
});