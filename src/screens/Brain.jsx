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
  Animated,
  ActivityIndicator,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import API from "../services/api";

export default function Brain() {
  const [idea, setIdea] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const animatedWidth = useState(new Animated.Value(40))[0];
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
    Animated.timing(animatedWidth, {
      toValue: 220,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSearch = () => {
    Animated.timing(animatedWidth, {
      toValue: 40,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setSearchOpen(false);
      setSearch("");
    });
  };

  // ✅ FETCH IDEAS
  const fetchIdeas = async () => {
    try {
      const res = await API.get("/ideas");
      const data = res.data?.ideas || res.data?.data;

      if (Array.isArray(data)) {
        setIdeas(data);
      } else {
        setIdeas([]);
      }
    } catch (err) {
      console.log("API error:", err.response?.data || err.message);
    }
  };

  // ✅ ADD IDEA
  const handleAddIdea = async () => {
    if (!idea.trim()) return Alert.alert("Enter idea first");

    try {
      setLoading(true);

      const res = await API.post("/ideas", {
        title: idea,
        description: idea,
        category: "Product",
      });

      const newIdea = res.data?.idea;

      if (newIdea) {
        setIdeas((prev) => [newIdea, ...prev]);
      }

      setIdea("");
    } catch (err) {
      Alert.alert("Error adding idea");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Product", "Business", "Startup", "Design", "Tech"];

  const filteredIdeas = (ideas || []).filter((item) => {
    const matchSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selected === "All" || item.category === selected;

    return matchSearch && matchCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Text style={styles.title}>My Brain</Text>
            <Text style={styles.subtitle}>
              A place to capture ideas, thoughts, and inspiration.
            </Text>
          </View>

          <View style={styles.rightSection}>
            <Animated.View
              style={[styles.searchAnimated, { width: animatedWidth }]}
            >
              {searchOpen ? (
                <>
                  <Feather name="search" size={16} color="#777" />
                  <TextInput
                    placeholder="Search..."
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    autoFocus
                  />
                  <TouchableOpacity onPress={closeSearch}>
                    <Feather name="x" size={18} color="#777" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={openSearch}>
                  <Feather name="search" size={18} color="#2E2626" />
                </TouchableOpacity>
              )}
            </Animated.View>

            <TouchableOpacity style={styles.iconBox}>
              <Feather name="sliders" size={18} color="#2E2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* INPUT */}
        <View style={styles.card}>
          <TextInput
            placeholder="Capture an idea before it disappears..."
            value={idea}
            onChangeText={setIdea}
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddIdea}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="plus" size={16} color="#fff" />
                  <Text style={styles.addText}>Add Idea</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Voice removed */}
            <TouchableOpacity
              style={styles.voiceBtn}
              onPress={() => Alert.alert("Voice coming soon")}
            >
              <Feather name="mic" size={16} color="#F35539" />
              <Text style={styles.voiceText}>Voice</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipWrapper}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                selected === item && styles.activeChip,
              ]}
              onPress={() => setSelected(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected === item && styles.activeChipText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LIST */}
        {filteredIdeas.length === 0 ? (
          <Text style={styles.empty}>No results found</Text>
        ) : (
          filteredIdeas.map((item) => (
            <View key={item._id} style={styles.ideaCard}>
              <Text style={styles.ideaTitle}>{item.title}</Text>
              <Text style={styles.ideaDesc}>{item.description}</Text>

              <View style={styles.tagRow}>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>
                    {item.category || "Product"}
                  </Text>
                </View>

                <View style={styles.secondaryTag}>
                  <Feather name="clock" size={12} color="#2E2626" />
                  <Text style={styles.secondaryText}>Just now</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Feather name="plus" size={22} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EC",
  },

  // ================= HEADER =================
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  leftSection: {
    flex: 1,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E2626",
  },

  subtitle: {
    fontSize: 14,
    color: "#8A7F7D",
    marginTop: 4,
  },

  // ================= SEARCH =================
  searchAnimated: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginRight: 10,

    // shadow
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#000",
  },

  // ================= ICON =================
  iconBox: {
    width: 40,
    height: 40, // 🔥 IMPORTANT (missing tha)
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  // ================= CARD =================
  card: {
    margin: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,

    elevation: 3,
  },

  input: {
  
    borderColor: "#ddd",
    marginBottom: 12,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  addBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F35539",
    paddingVertical: 10,
    borderRadius: 8,
  },

  addText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },

  voiceBtn: {
    marginLeft: 10,
    paddingVertical: 10,
    // borderWidth: 1,
    // borderColor: "#F35539",
    borderRadius: 8,
    backgroundColor: "#FFF1EA",
    width: 110,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  voiceText: {
    color: "#F35539",
    marginLeft: 5,
    fontWeight: "500",
  },

  chipWrapper: {
  marginTop: 10,
  paddingLeft: 20,
},

chip: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  backgroundColor: "#fff",
  borderRadius: 20,
  marginRight: 10,

  // shadow
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.03,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
},

activeChip: {
  backgroundColor: "#F35539",
},

chipText: {
  fontSize: 14,
  fontWeight: "500",
  color: "#2E2626",
},

activeChipText: {
  color: "#fff",
},

  // ================= LIST =================
ideaCard: {
  marginHorizontal: 20,
  marginBottom: 16,
  padding: 16,
  backgroundColor: "#fff",
  borderRadius: 16,

  // border (figma)
  borderWidth: 1,
  borderColor: "rgba(243,85,57,0.1)",

  // shadow
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 16,
},

ideaTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#2E2626",
  lineHeight: 24,
},

ideaDesc: {
  marginTop: 10,
  fontSize: 14,
  color: "#8A7F7D",
  lineHeight: 20,
},

tagRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 12,
},

// 🔴 primary tag
categoryTag: {
  backgroundColor: "#FFF1EA",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 6,
},

categoryText: {
  color: "#F35539",
  fontSize: 12,
  fontWeight: "600",
},

// ⚪ secondary tag
secondaryTag: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F5EDEE",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 6,
  marginLeft: 8,
},

secondaryText: {
  fontSize: 12,
  color: "#2E2626",
  marginLeft: 5,
},

  // ================= FAB =================
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#F35539",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",

    elevation: 5,
  },
});