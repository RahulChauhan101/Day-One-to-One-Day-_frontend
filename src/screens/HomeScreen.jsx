import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import API from "../services/api";
import FAB from "../components/FAB";
import QuickCapture from "../components/QuickCapture";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {

  // ✅ HOOKS
  const [energy, setEnergy] = useState('Very High');
  const [mood, setMood] = useState('Motivated');
  const [showMood, setShowMood] = useState(false);

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const energyLevels = ['Very High', 'Good', 'Normal', 'Low'];
  const moodLevels = ['Motivated', 'Focused', 'Neutral', 'Stressed'];

  // ✅ USER LOAD
  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) setUser(JSON.parse(data));
    };
    loadUser();
  }, []);

  // ✅ FETCH TASKS
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.log("TASK ERROR:", err?.response?.data);
    }
  };

  // ✅ TOGGLE TASK
  const toggleTask = async (taskId, currentStatus) => {
    try {
      // UI update
      setTasks(prev =>
        prev.map(t =>
          t._id === taskId ? { ...t, isCompleted: !currentStatus } : t
        )
      );

      // API call
      await API.patch(`/tasks/${taskId}`, {
        isCompleted: !currentStatus,
      });

    } catch (err) {
      console.log("TOGGLE ERROR:", err?.response?.data);
    }
  };
const createTask = async () => {
  try {
    const payload = {
      title: title, // dynamic input use करो
      description: description,
      priority: "medium",
      dueDate: new Date().toISOString(),
      dreamId: dreamId, // 🔥 MAIN FIX
    };

    const res = await API.post("/tasks", payload);

    console.log("SUCCESS:", res.data);

    navigation.goBack();

  } catch (err) {
    console.log("ERROR:", err?.response?.data);
  }
};
  // ✅ PROGRESS
  const completed = tasks.filter(t => t.isCompleted).length;
  const progress = tasks.length
    ? (completed / tasks.length) * 100
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Good Morning, {user?.name || "Guest"}
            </Text>
            <Text style={styles.subtitle}>
              Small steps today create big dreams tomorrow.
            </Text>
          </View>

          <Image
            source={require('../assets/images/image.jpg')}
            style={styles.avatar}
          />
        </View>

        {/* ENERGY */}
        <View style={styles.inlineRow}>
          <Text style={styles.label}>Energy</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {energyLevels.map(item => {
              const active = energy === item;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setEnergy(item);
                    setShowMood(true);
                  }}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* MOOD */}
        {showMood && (
          <View style={styles.inlineRow}>
            <Text style={styles.label}>Mood</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {moodLevels.map(item => {
                const active = mood === item;
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setMood(item)}
                    style={[styles.pill, active && styles.pillActive]}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* TODAY FOCUS */}
        {showMood && (
          <View style={styles.section}>
            <View style={styles.progressCard}>
              <Text style={{ color: '#F35539', fontWeight: '600' }}>
                Today's Focus
              </Text>

              <Text style={styles.heading}>
                {tasks[0]?.title || "No Task"}
              </Text>

              <Text style={{ color: '#8A7B78' }}>
                {tasks.length} tasks scheduled today
              </Text>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

<TouchableOpacity
  style={styles.focusBtn}
  onPress={() => navigation.navigate("Dreams")}
>
                <Text style={styles.focusBtnText}>View Dream</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 🔥 TASK LIST WITH CLICK */}
        <View style={styles.section}>
          <Text style={styles.heading}>Today's Tasks</Text>

          {tasks.map(item => (
            <View key={item._id} style={styles.taskCardNew}>

              {/* CLICKABLE CHECKBOX */}
              <TouchableOpacity
                onPress={() => toggleTask(item._id, item.isCompleted)}
              >
                {item.isCompleted ? (
                  <View style={styles.checkboxDone}>
                    <Feather name="check" size={14} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.checkboxOutline} />
                )}
              </TouchableOpacity>

              {/* CONTENT */}
              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    item.isCompleted && {
                      textDecorationLine: 'line-through',
                      color: '#8A7B78',
                    },
                  ]}
                >
                  {item.title}
                </Text>

                <View style={styles.tagJarvis}>
                  <Text style={styles.tagJarvisText}>
                    {item.priority?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 🔥 DREAM PROGRESS */}
<View style={styles.dreamSection}>

  <Text style={styles.dreamHeading}>Dream Progress</Text>

  <View style={styles.dreamCard}>

    {/* TOP ROW */}
    <View style={styles.dreamRow}>
      <Text style={styles.dreamTitle}>
        {tasks[0]?.title || "No Active Dream"}
      </Text>

      <Text style={styles.dreamPercent}>
        {Math.round(progress)}%
      </Text>
    </View>

    {/* PROGRESS BAR */}
    <View style={styles.progressBg}>
      <View
        style={[
          styles.progressFill,
          { width: `${progress}%` },
        ]}
      />
    </View>

    {/* FOOTER TEXT */}
    <Text style={styles.dreamSub}>
      Consistency builds extraordinary results.
    </Text>

  </View>
</View>

        {/* QUICK CAPTURE */}
<QuickCapture
  onPressItem={(item) => {
    switch (item.title) {

      case "Add Task":
        navigation.navigate("Task");
        break;

      case "Add Idea":
        navigation.getParent()?.navigate("IdeaScreen"); // ✅ FIX
        break;

      case "Voice Note":
        navigation.getParent()?.navigate("VoiceScreen"); // ✅ FIX
        break;

      default:
        console.log("Unknown action");
    }
  }}
/>

      </ScrollView>

      <FAB onPress={() => console.log("FAB Clicked")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EC',
  },

  block: {
    marginTop: 16,
  },

  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },

  pillScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 10,
  },
  blockLabel: {
    width: 60,
    fontSize: 13,
    fontWeight: '600',
    color: '#2E2626',
  },

  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    flex: 1,
  },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',

    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  pillActive: {
    backgroundColor: '#F35539',
    borderColor: '#F35539',

    shadowColor: '#F35539',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E2626',
  },

  pillTextActive: {
    color: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    padding: 20,
    gap: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E2626',
  },

  subtitle: {
    fontSize: 13,
    color: '#8A7B78',
    marginTop: 5,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontWeight: '700',
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  label: {
    fontWeight: '600',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  energyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6, // 👈 EXACT FIGMA
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',

    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  activeBtn: {
    backgroundColor: '#F35539',
    borderColor: '#F35539',

    shadowColor: '#F35539',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  energyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E2626',
  },

  activeText: {
    color: '#FFFFFF',
  },

  headingTask: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F35539',
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 25,
  },

  subHeading: {
    marginTop: 10,
    color: '#8A7B78',
    fontWeight: '600',
  },

  focusCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },

  focusTitle: {
    fontWeight: '700',
  },

  focusSub: {
    color: '#8A7B78',
    marginTop: 4,
  },

  focusProgress: {
    height: 6,
    backgroundColor: '#F3E9E6',
    borderRadius: 10,
    marginTop: 10,
  },

  focusFill: {
    width: '45%',
    height: '100%',
    backgroundColor: '#F35539',
    borderRadius: 10,
  },

  focusBtn: {
    marginTop: 12,
    backgroundColor: '#FDEAE6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  focusBtnText: {
    color: '#F35539',
    fontWeight: '600',
  },

  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,

    // soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#8A7B78',
    borderRadius: 6,
    marginRight: 12,
  },

  checkboxDone: {
    width: 22,
    height: 22,
    backgroundColor: '#F35539',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  taskText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E2626',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#8A7B78',
  },

  subHeading: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#8A7B78',
  },

  tag: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  tagText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  progressCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },

  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  percent: {
    color: '#F35539',
    fontWeight: '700',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#F3E9E6',
    borderRadius: 10,
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#F35539',
    borderRadius: 10,
  },

  progressText: {
    marginTop: 10,
    color: '#0f0e0e',
  },
  subSection: {
    marginTop: 16,
  },

  subHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A7B78',
    marginBottom: 8,
  },

  taskCardNew: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },

  checkboxOutline: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#8A7B78',
    borderRadius: 6,
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E2626',
  },

  tagJarvis: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(243, 85, 57, 0.1)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  tagJarvisText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F35539',
  },

  dreamSection: {
  paddingHorizontal: 20,
  marginTop: 20,
},

dreamHeading: {
  fontSize: 18,
  fontWeight: "700",
  color: "#2E2626",
  marginBottom: 10,
},

dreamCard: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 16,
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 16,
  elevation: 3,
},

dreamRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

dreamTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#2E2626",
},

dreamPercent: {
  fontSize: 16,
  fontWeight: "700",
  color: "#F35539",
},

progressBg: {
  height: 8,
  backgroundColor: "#F3E9E6",
  borderRadius: 8,
  overflow: "hidden",
  marginBottom: 10,
},

progressFill: {
  height: "100%",
  backgroundColor: "#F35539",
  borderRadius: 8,
},

dreamSub: {
  fontSize: 13,
  color: "#8A7B78",
},
});
