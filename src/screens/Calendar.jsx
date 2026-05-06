import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";

import FAB from "../components/FAB";
import api from "../services/api";

export default function Calender() {

  const [dreams, setDreams] = useState([]);
  const [tasks, setTasks] = useState([]);

  // FETCH DREAMS
  useEffect(() => {
    fetchDreams();
    fetchTasks();
  }, []);

  const fetchDreams = async () => {
    try {

      const res = await api.get("/dreams");

      console.log("DREAM API:", res.data);

      setDreams(res.data.dreams || []);

    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  const fetchTasks = async () => {
  try {

    const res = await api.get("/tasks");

    console.log("TASKS:", res.data);

    setTasks(res.data.tasks || []);

  } catch (err) {
    console.log("TASK ERROR:", err);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Life Insights</Text>

            <Text style={styles.subtitle}>
              Your progress after 21 days of consistency.
            </Text>
          </View>

          <View style={styles.iconBox}>
            <Feather name="calendar" size={18} />
          </View>
        </View>

        {/* CONSISTENCY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Consistency Score</Text>

          <View style={styles.row}>
            <View style={styles.circle}>
              <Text style={styles.score}>78%</Text>
            </View>

            <Text style={styles.desc}>
              You completed tasks on 16 out of the last 21 days.
              Keep it up!
            </Text>
          </View>
        </View>

        {/* AI INSIGHT */}
        <View style={styles.aiCard}>

          <View style={styles.row}>
            <Feather
              name="zap"
              size={18}
              color="#F35539"
            />

            <Text style={styles.aiTitle}>
              AI Insight
            </Text>
          </View>

          <Text style={styles.aiText}>
            Your productivity peaks between
            9 AM and 12 PM.
          </Text>

        </View>

        {/* DREAM PROGRESS */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Dream Progress
          </Text>

          {dreams.length > 0 ? (

            dreams.map((item) => (

              <View
                key={item._id}
                style={{ marginBottom: 14 }}
              >

                <View style={styles.progressRow}>

                  <Text style={styles.dreamTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.percent}>
                    {item.progress || 0}%
                  </Text>

                </View>

                <View style={styles.barBg}>

                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${item.progress || 0}%`,
                      },
                    ]}
                  />

                </View>

                <Text style={styles.subText}>
                  {item.subTitle}
                </Text>

                <Text style={styles.statusText}>
                  {item.status}
                </Text>

              </View>

            ))

          ) : (

            <Text style={{ color: "#8A7F7D" }}>
              No dreams found
            </Text>

          )}

        </View>

        {/* MOST PRODUCTIVE */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Most Productive Days
          </Text>

          <View style={styles.productiveContainer}>

            {[
              { d: "Mon", v: 8 },
              { d: "Tue", v: 12 },
              { d: "Wed", v: 10 },
              { d: "Thu", v: 5 },
              { d: "Fri", v: 7 },
            ].map((item, i) => {

              const isActive = item.v === 12;

              return (
                <View
                  key={i}
                  style={styles.productiveItem}
                >

                  <View
                    style={{
                      width: 6,
                      height: item.v * 4,
                      backgroundColor: isActive
                        ? "#F35539"
                        : "#EADFD8",
                      borderRadius: 3,
                    }}
                  />

                  <Text
                    style={[
                      styles.productiveValue,
                      isActive && {
                        color: "#F35539",
                      },
                    ]}
                  >
                    {item.v}
                  </Text>

                  <Text style={styles.productiveDay}>
                    {item.d}
                  </Text>

                </View>
              );
            })}

          </View>
        </View>

{/* FOCUS */}
<View style={styles.card}>

  <Text style={styles.cardTitle}>
    Focus Distribution
  </Text>

  <View style={styles.focusContainer}>

    <View style={styles.legendBox}>

      {/* HIGH */}
      <View style={styles.legendRow}>

        <View
          style={[
            styles.dot,
            { backgroundColor: "#FF3B30" },
          ]}
        />

        <Text style={styles.legendText}>
          High Priority (
          {
            tasks.filter(
              (t) => t.priority === "high"
            ).length
          }
          )
        </Text>

      </View>

      {/* MEDIUM */}
      <View style={styles.legendRow}>

        <View
          style={[
            styles.dot,
            { backgroundColor: "#F5A623" },
          ]}
        />

        <Text style={styles.legendText}>
          Medium Priority (
          {
            tasks.filter(
              (t) => t.priority === "medium"
            ).length
          }
          )
        </Text>

      </View>

      {/* LOW */}
      <View style={styles.legendRow}>

        <View
          style={[
            styles.dot,
            { backgroundColor: "#34C759" },
          ]}
        />

        <Text style={styles.legendText}>
          Low Priority (
          {
            tasks.filter(
              (t) => t.priority === "low"
            ).length
          }
          )
        </Text>

      </View>

    </View>

  </View>

</View>

{/* ENERGY GRAPH */}
<View style={styles.card}>

  <Text style={styles.cardTitle}>
    Energy vs Productivity
  </Text>

  <View style={styles.chart}>

    {tasks.length > 0 ? (

      tasks.map((task) => {

        const barHeight =
          task.isCompleted
            ? 90
            : task.priority === "high"
            ? 80
            : task.priority === "medium"
            ? 60
            : 40;

        return (

          <View
            key={task._id}
            style={styles.taskBarContainer}
          >

       <Text style={styles.priorityText}>
    {task.priority}
  </Text>
       

<View
  style={[
    styles.newBar,
    {
      height: barHeight,

      backgroundColor:
        task.priority === "high"
          ? "#FF3B30"
          : task.priority === "medium"
          ? "#F5A623"
          : "#34C759",

      width: 28,
      borderRadius: 10,

      borderWidth: 2,
      borderColor: "#FFFFFF",

      marginTop: 14,
    },
  ]}
/>

            <Text
              numberOfLines={1}
              style={styles.taskLabel}
            >
              {task.title}
            </Text>

          </View>

        );
      })

    ) : (

      <Text>No task data</Text>

    )}

  </View>

  <Text style={styles.smallText}>
    You complete more tasks on high-energy days.
  </Text>

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
  },

  subtitle: {
    color: "#8A7F7D",
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
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },

  cardTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF1EA",
    justifyContent: "center",
    alignItems: "center",
  },

  score: {
    color: "#F35539",
    fontWeight: "700",
  },

  desc: {
    flex: 1,
    color: "#8A7F7D",
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  dreamTitle: {
    fontWeight: "600",
  },

  percent: {
    color: "#F35539",
    fontWeight: "700",
  },

  barBg: {
    height: 6,
    backgroundColor: "#F5EDEE",
    borderRadius: 4,
  },

  barFill: {
    height: 6,
    backgroundColor: "#F35539",
    borderRadius: 4,
  },

  subText: {
    marginTop: 6,
    color: "#8A7F7D",
    fontSize: 12,
  },

  statusText: {
    marginTop: 4,
    color: "#F35539",
    fontSize: 12,
    fontWeight: "600",
  },

  productiveContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 12,
    marginTop: 20,
  },

  productiveItem: {
    alignItems: "center",
    gap: 16,
    width: 50,
  },

  productiveValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8A7F7D",
  },

  productiveDay: {
    fontSize: 12,
    color: "#8A7F7D",
  },

  focusContainer: {
    alignItems: "center",
    gap: 24,
    marginTop: 16,
  },

  legendBox: {
    flex: 1,
    gap: 12,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendText: {
    fontSize: 13,
    color: "#8A7F7D",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },

  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 20,
    height: 100,
  },

  newBar: {
    width: 20,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  smallText: {
    marginTop: 10,
    fontSize: 13,
    color: "#8A7F7D",
  },

  aiCard: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFF1EA",
    borderWidth: 1,
    borderColor: "#F35539",
  },

  aiTitle: {
    color: "#F35539",
    fontWeight: "700",
  },

  aiText: {
    marginTop: 8,
  },

taskBarContainer: {
  alignItems: "center",
  width: 60,
  
},

priorityText: {
  fontSize: 10,
  fontWeight: "700",
  textTransform: "capitalize",

  color: "#F35539",
  marginBottom: 6,
},
taskBarContainer: {
  alignItems: "center",
  width: 70,
  justifyContent: "flex-end",
},

taskLabel: {
  marginTop: 10,
  fontSize: 11,
  color: "#8A7F7D",
  textAlign: "center",
  fontWeight: "600",
},

newBar: {
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

});