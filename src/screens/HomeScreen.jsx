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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FAB from "../components/FAB";
import QuickCapture from "../components/QuickCapture";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [energy, setEnergy] = useState('Very High');
  const [mood, setMood] = useState('Motivated',);
  const [showMood, setShowMood] = useState(false);

  const energyLevels = ['Very High', 'Good', 'Normal', 'Low'];
  const moodLevels = ['Motivated', 'Focused', 'Neutral', 'Stressed'];
  const [user, setUser] = useState(null);
  const tasks = [
    { id: 1, title: 'Build login API', tag: 'Dream - Jarvis', color: '#F35539' },
    { id: 2, title: 'Submit office report', tag: 'WORK', color: '#007AFF' },
    { id: 3, title: 'Gym workout', tag: 'PERSONAL', color: '#8A7B78' },
  ];

  useEffect(() => {
  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");

    if (data) {
      setUser(JSON.parse(data));
    }
  };

  loadUser();
}, []);

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
            setShowMood(true); // 👈 trigger full UI
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

        {/* MOOD (SHOW AFTER ENERGY SELECT) */}
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
          <Text style={styles.heading}> Build Jarvis</Text>
    
      <Text style={{color: '#8A7B78' }}>
        3 tasks scheduled today
      </Text>
         <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '191.75' }]} />
            </View>

      <TouchableOpacity style={styles.focusBtn}>
        <Text style={styles.focusBtnText}>View Dream</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

        {/* TASKS */}
        <View style={styles.section}>
          <Text style={styles.heading}>Today's Tasks</Text>
          {/* DREAM TASKS */}
<View style={styles.subSection}>
  <Text style={styles.subHeading}>Dream Tasks</Text>

  {[
    { title: 'Build login API' },
    { title: 'Design marketplace database' },
  ].map((item, i) => (
    <View key={i} style={styles.taskCardNew}>
      
      {/* Checkbox */}
      <View style={styles.checkboxOutline} />

      {/* Content */}
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>

        {/* Tag */}
        <View style={styles.tagJarvis}>
          <Text style={styles.tagJarvisText}>JARVIS</Text>
        </View>
      </View>
    </View>
  ))}
</View>

          {tasks.map((item, i) => {
            const isDone = i === 2;

            return (
              <View key={item.id} style={styles.taskCard}>
                {isDone ? (
                  <View style={styles.checkboxDone}>
                    <Feather name="check" size={14} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.checkbox} />
                )}

                <View style={{ flex: 1 }}>
                  <Text style={[styles.taskText, isDone && styles.taskDone]}>
                    {item.title}
                  </Text>

                  <View
                    style={[
                      styles.tag,
                      {
                        backgroundColor:
                          item.color === '#8A7B78'
                            ? '#F3E9E6'
                            : item.color + '1A',
                      },
                    ]}
                  >
                    <Text style={[styles.tagText, { color: item.color }]}>
                      {item.tag}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* PROGRESS */}
        <View style={styles.section}>
          <Text style={styles.heading}>Dream Progress</Text>

          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text>Dream: Build Jarvis</Text>
              <Text style={styles.percent}>32%</Text>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '32%' }]} />
            </View>

            <Text style={styles.progressText}>
              Keep going. Every task brings you closer.
            </Text>
          </View>
        </View>

        {/* QUICK CAPTURE */}
<View>
  <QuickCapture
  onPressItem={(item) => {
    console.log(item);

    if (item.title === "Add Task") {
      navigation.navigate("TaskScreen");
    } else if (item.title === "Add Idea") {
      navigation.navigate("IdeaScreen");
    } else if (item.title === "Voice Note") {
      navigation.navigate("VoiceScreen");
    }
  }}
/>
</View>

      </ScrollView>

      {/* FAB */}
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
});