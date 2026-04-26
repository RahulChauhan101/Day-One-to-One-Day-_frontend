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
  const [showSearch, setShowSearch] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newDream, setNewDream] = useState("");
  const [actions, setActions] = useState([]);
  const [tasks, setTasks] = useState([]);

  const filters = ["All Dreams", "Active", "Completed", "High", "Medium"];

  useEffect(() => {
    getDreams();
    getExtras();
  }, []);

  const getDreams = async () => {
    try {
      const res = await API.get("/dreams");
      setDreams(res.data.dreams || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getExtras = async () => {
    try {
      const [aRes, tRes] = await Promise.all([
        API.get("/actions"),
        API.get("/tasks"),
      ]);
      setActions(aRes.data.actions || []);
      setTasks(tRes.data.tasks || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  // 🎨 STATUS COLOR
  const getStatusStyle = (item) => {
    const p = (item.priority || "").toLowerCase().trim();
    if (p === "high") return { backgroundColor: "#F35539" };
    if (p === "medium") return { backgroundColor: "#FFA500" };
    if (p === "low") return { backgroundColor: "#4CAF50" };
    return { backgroundColor: "#999" };
  };

  // 🔍 FILTER + SEARCH
  const filteredDreams = dreams.filter((item) => {
    const matchFilter =
      filter === "All Dreams"
        ? true
        : filter === "Active"
        ? item.status === "in progress"
        : filter === "Completed"
        ? item.progress === 100
        : filter === "High"
        ? item.priority === "high"
        : filter === "Medium"
        ? item.priority === "medium"
        : true;

    const matchSearch =
      (item.title || "").toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

const handleAddDream = async () => {
  if (!newDream.trim()) {
    return Alert.alert("Enter dream name");
  }

  try {
    const res = await API.post("/dreams", {
      title: newDream,
      subTitle: newDream,
      description: newDream,
      priority: "high",
      type: "work",          // 🔥 ADD THIS
      status: "in progress", // 🔥 ADD THIS
    });

    console.log("ADD RESPONSE:", res.data);

    setDreams((prev) => [res.data.dream, ...prev]);
    setFilter("All Dreams");
    setNewDream("");
    setShowInput(false);

  } catch (err) {
    console.log("ERROR DATA:", err.response?.data);
    Alert.alert("Error", err.response?.data?.message || "Failed");
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Dreams</Text>
            <Text style={styles.subtitle}>
              Your big goals that guide your daily actions.
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setShowSearch(true)}
            >
              <Feather name="search" size={18} color="#2E2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 🔍 SEARCH BAR */}
        {showSearch && (
          <View style={styles.searchBox}>
            <Feather name="search" size={16} color="#777" />

            <TextInput
              placeholder="Search dreams..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              autoFocus
            />

            <TouchableOpacity
              onPress={() => {
                setShowSearch(false);
                setSearch("");
              }}
            >
              <Feather name="x" size={18} color="#777" />
            </TouchableOpacity>
          </View>
        )}

        {/* FILTER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterWrapper}>
          {filters.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filterChip,
                filter === item && styles.activeFilterChip,
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
        </ScrollView>

        {/* ADD INPUT */}
        {showInput && (
          <View style={styles.addBox}>
            <TextInput
              placeholder="Enter dream..."
              value={newDream}
              onChangeText={setNewDream}
              style={styles.input}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddDream}>
              <Text style={styles.addBtnText}>Add</Text>
              
            </TouchableOpacity>
          </View>
        )}

        {/* LIST */}
        {filteredDreams.map((item) => (
          <View key={item._id} style={styles.card}>

            <View style={styles.cardHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.typeTag}>
                  <Feather name="briefcase" size={12} />
                </View>

              </View>

              <View style={[styles.statusBadge, getStatusStyle(item)]}>
                
                <Text style={styles.statusText}>
                  {(item.priority || "").toUpperCase()}
                </Text>
              </View>
            </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.subTitle}>{item.subTitle}</Text>
            
            <Text style={styles.cardDesc}>{item.description}</Text>

            {/* PROGRESS */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercent}>
                  {item.progress || 0}%
                </Text>
              </View>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(item.progress || 0, 5)}%` },
                  ]}
                />
              </View>

              {/* 🔥 BOTTOM LINE */}
              <View style={styles.bottomRow}>
                <Text style={styles.bottomText}>
                  {actions.length} Actions
                </Text>

                <View style={styles.dot} />

                <Text style={styles.bottomText}>
                  {tasks.length} Tasks
                </Text>
              </View>
            </View>

          </View>
        ))}
      </ScrollView>

<FAB onPress={() => setShowInput(prev => !prev)} />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF4EC" },

  header: { paddingTop: 30, paddingHorizontal: 20 },

  title: { fontSize: 24, fontWeight: "700" },

  subtitle: { fontSize: 13, color: "#777", marginTop: 4 },

  countText: {
    fontSize: 12,
    color: "#F35539",
    marginTop: 6,
    fontWeight: "600",
  },

header: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingTop: 30,
  paddingHorizontal: 20,
},

headerRight: {
  flexDirection: "row",
},

iconBtn: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
},

searchBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  marginHorizontal: 20,
  marginTop: 10,
  paddingHorizontal: 12,
  height: 40,
  borderRadius: 20,
  elevation: 2,
},

  searchInput: { marginLeft: 8, flex: 1 },

  filterWrapper: { marginTop: 15, paddingLeft: 20 },

  filterChip: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },

  activeFilterChip: { backgroundColor: "#F35539" },

  filterText: { fontSize: 13 },

  activeFilterText: { color: "#fff" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 16,
    borderRadius: 18,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: { fontSize: 16, fontWeight: "700" },

  typeTag: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FDF4EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },

  subTitle: { marginTop: 5, fontSize: 12, color: "#F35539" },

  cardDesc: { marginTop: 6, fontSize: 13, color: "#777" },

  progressContainer: { marginTop: 10 },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressLabel: { fontSize: 12, color: "#777" },

  progressPercent: { fontSize: 12, fontWeight: "600" },

  progressBar: {
    height: 8,
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#F35539",
    borderRadius: 10,
  },

  bottomRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
},

bottomItem: {
  flexDirection: "row",
  alignItems: "center",
},

bottomText: {
  fontSize: 11,
  color: "#777",
  marginLeft: 4,
},

dot: {
  width: 5,
  height: 5,
  borderRadius: 2.5,
  backgroundColor: "#999",
  marginHorizontal: 8,
},

addBox: {
  flexDirection: "row",          // 👈 input + button side by side
  alignItems: "center",
  marginHorizontal: 20,
  marginTop: 15,
  padding: 10,

  backgroundColor: "#fff",
  borderRadius: 16,

  // shadow
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
},

input: {
  flex: 1,
  fontSize: 14,
  paddingHorizontal: 12,
  paddingVertical: 10,

  backgroundColor: "#F9F9F9",
  borderRadius: 10,
},

addBtn: {
  marginLeft: 10,
  backgroundColor: "#F35539",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 10,
},

addBtnText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 13,
},
});
