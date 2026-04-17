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
import API from "../services/api";

export default function Dreams() {
  const [dreams, setDreams] = useState([]);

  // 🔥 Fetch Dreams
  const getDreams = async () => {
    try {
      const res = await API.get("/dreams");

      console.log("DREAMS:", res.data);

      setDreams(res.data.dreams || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getDreams();
  }, []);

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

          <View style={styles.searchBox}>
            <Feather name="search" size={18} />
          </View>
        </View>

        {/* FILTERS */}
        <View style={styles.filterRow}>
          {["All Dreams", "Active", "Completed"].map((item, i) => (
            <View
              key={i}
              style={[styles.filter, i === 0 && styles.activeFilter]}
            >
              <Text
                style={[
                  styles.filterText,
                  i === 0 && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* 🔥 DYNAMIC DREAM LIST */}
        {dreams.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No dreams found
          </Text>
        ) : (
          dreams.map((item) => (
            <DreamCard
              key={item._id}
              title={item.title}
              subTitle={item.subTitle}
              desc={item.description}
              progress={item.progress || 0}
              tag={item.priority?.toUpperCase()}
              status={item.status}
              user={item.userId?.name}
            />
          ))
        )}

      </ScrollView>

      {/* FLOAT BUTTON */}
      <FAB onPress={() => console.log("FAB Clicked")} />
    </SafeAreaView>
  );
}

// 🔥 CARD COMPONENT
const DreamCard = ({
  title,
  subTitle,
  desc,
  progress,
  tag,
  status,
  user,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.iconSmall}>
          <Feather name="briefcase" size={14} />
        </View>

        <Text
          style={[
            styles.tag,
            tag === "HIGH" ? styles.high : styles.medium,
          ]}
        >
          {tag}
        </Text>
      </View>

      <Text style={styles.cardTitle}>{title}</Text>

      {/* Subtitle */}
      <Text style={styles.subTitle}>{subTitle}</Text>

      <Text style={styles.cardDesc}>{desc}</Text>

      {/* User */}
      <Text style={styles.meta}>By: {user}</Text>

      {/* Status */}
      <Text style={styles.status}>Status: {status}</Text>

      {/* Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressLabel}>{progress}%</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>
    </View>
  );
};

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF4EC",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E2626",
  },

  subtitle: {
    fontSize: 13,
    color: "#8A7F7D",
    marginTop: 4,
  },

  searchBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },

  filter: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeFilter: {
    backgroundColor: "#F35539",
  },

  filterText: {
    fontSize: 12,
    color: "#2E2626",
  },

  activeFilterText: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 18,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF1EA",
    justifyContent: "center",
    alignItems: "center",
  },

  tag: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: "600",
  },

  high: {
    backgroundColor: "#FFE5E0",
    color: "#F35539",
  },

  medium: {
    backgroundColor: "#FFF3D9",
    color: "#F59E0B",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    color: "#2E2626",
  },

  subTitle: {
    fontSize: 12,
    color: "#F35539",
    marginTop: 2,
  },

  cardDesc: {
    fontSize: 13,
    color: "#8A7F7D",
    marginTop: 6,
  },

  meta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  status: {
    fontSize: 12,
    color: "#10B981",
    marginTop: 4,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  progressLabel: {
    fontSize: 12,
    color: "#8A7F7D",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 5,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#F35539",
    borderRadius: 10,
  },
});