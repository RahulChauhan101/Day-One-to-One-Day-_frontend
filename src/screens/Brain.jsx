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
  PermissionsAndroid,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import Voice from "@react-native-voice/voice";
import API from "../services/api";

export default function Brain() {
  const [idea, setIdea] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // ✅ REQUEST PERMISSION
  const requestPermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
    } catch (err) {
      console.log("Permission error:", err);
    }
  };

  // ✅ INIT
  useEffect(() => {
    requestPermission();
    fetchIdeas();

    Voice.onSpeechStart = () => {
      console.log("🎤 Start");
    };

    Voice.onSpeechEnd = () => {
      console.log("🎤 End");
      setListening(false);
    };

    Voice.onSpeechError = (e) => {
      console.log("Voice error:", e);
      setListening(false);
    };

    Voice.onSpeechResults = (e) => {
      if (e.value?.length > 0) {
        setIdea(e.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // ✅ FETCH IDEAS
  const fetchIdeas = async () => {
    try {
      const res = await API.get("/ideas");
      setIdeas(res.data?.ideas || res.data?.data || []);
    } catch (err) {
      console.log("API error:", err.message);
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

  // 🎤 START VOICE
const startListening = async () => {
  try {
    if (listening) return;

    await Voice.start("en-US"); // ❌ no destroy

    setListening(true);
  } catch (e) {
    console.log("Start error:", e);
  }
};

  // 🛑 STOP VOICE (CRASH FIXED)
const stopListening = async () => {
  try {
    if (!listening) return;

    await Voice.stop();
    setListening(false);
  } catch (e) {
    console.log("Stop error:", e);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Brain</Text>
            <Text style={styles.subtitle}>
              Capture ideas & dreams 🚀
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

        {/* INPUT CARD */}
        <View style={styles.card}>
          <TextInput
            placeholder="Write your idea..."
            value={idea}
            onChangeText={setIdea}
            style={styles.input}
          />

          <View style={styles.row}>
            {/* ADD */}
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

            {/* VOICE */}
            <TouchableOpacity
              style={[
                styles.voiceBtn,
                listening && { backgroundColor: "#F35539" },
              ]}
onPress={() => {
  console.log("VOICE CLICKED"); // 👈 check
  listening ? stopListening() : startListening();
}}
            >
              <Feather
                name="mic"
                size={16}
                color={listening ? "#fff" : "#F35539"}
              />
              <Text
                style={[
                  styles.voiceText,
                  listening && { color: "#fff" },
                ]}
              >
                {listening ? "Listening..." : "Voice"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LIST */}
        {ideas.length === 0 ? (
          <Text style={styles.empty}>No ideas found</Text>
        ) : (
          ideas.map((item) => (
            <View key={item._id} style={styles.ideaCard}>
              <Text style={styles.ideaTitle}>{item.title}</Text>
              <Text style={styles.ideaDesc}>{item.description}</Text>
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
  container: { flex: 1, backgroundColor: "#FFF5EC" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E2626",
  },

  subtitle: {
    fontSize: 14,
    color: "#8A7F7D",
  },

  iconRow: { flexDirection: "row", gap: 10 },

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
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },

  row: { flexDirection: "row", alignItems: "center" },

  addBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F35539",
    padding: 10,
    borderRadius: 6,
  },

  addText: { color: "#fff", marginLeft: 5 },

  voiceBtn: {
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F35539",
    borderRadius: 6,
    width: 110,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  voiceText: { color: "#F35539", marginLeft: 5 },

  ideaCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
  },

  ideaTitle: { fontWeight: "700" },

  ideaDesc: { marginTop: 5, color: "#777" },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },

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
  },
});