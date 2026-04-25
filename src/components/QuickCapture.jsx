import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../theme/colors";

const QuickCapture = ({ onPressItem }) => {
  const data = [
    { title: "Add Task", icon: "check-square", type: "feather" },
    { title: "Add Idea", icon: "lightbulb-outline", type: "material" },
    { title: "Voice Note", icon: "mic", type: "feather" },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Quick Capture</Text>

      <View style={styles.quickRow}>
        {data.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.quickItem}
            onPress={() => onPressItem(item)}
          >
            <View style={styles.quickBtn}>
              {item.type === "material" ? (
                <MaterialCommunityIcons name={item.icon} size={22} color="#fff" />
              ) : (
                <Feather name={item.icon} size={22} color="#fff" />
              )}
            </View>

            <Text style={styles.quickText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QuickCapture;

const styles = StyleSheet.create({
  section: {
    marginVertical: 15,
    height: 190,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  quickItem: {
    alignItems: "center",
  },
  quickBtn: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginLeft: 10,
    marginTop: 5,
  },
  quickText: {
    fontSize: 12,
  },
});