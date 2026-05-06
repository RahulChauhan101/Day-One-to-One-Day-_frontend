import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from 'react-native-vector-icons/FontAwesome5';

const SocialButton = ({ icon, text, onPress }) => {
  return (
    <TouchableOpacity style={styles.socialBtn} onPress={onPress}>
      <Icon name={icon} size={18} color="#000" />
      <Text style={styles.socialText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  socialBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
  },

  socialText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2626",
  },
});