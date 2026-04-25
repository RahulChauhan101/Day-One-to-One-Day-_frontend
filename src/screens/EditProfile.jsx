import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

export default function EditProfile({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        const user = JSON.parse(data);
        setName(user.name || "");
        setPhone(user.phone || "");
        setImage(user.image || null);
      }
    };
    loadUser();
  }, []);

  const pickImage = () => {
    launchImageLibrary({}, (res) => {
      if (res.assets) {
        setImage(res.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    const updatedUser = { name, phone, image };
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      
      {/* IMAGE */}
      <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
        <Image
          source={
            image
              ? { uri: image }
              : require("../assets/images/image.jpg")
          }
          style={styles.avatar}
        />
        <Text style={{ marginTop: 8 }}>Change Image</Text>
      </TouchableOpacity>

      {/* NAME */}
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* PHONE */}
      <TextInput
        placeholder="Enter Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      {/* SAVE */}
      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={{ color: "#fff" }}>Save</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  imageBox: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  btn: {
    backgroundColor: "#F35539",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});