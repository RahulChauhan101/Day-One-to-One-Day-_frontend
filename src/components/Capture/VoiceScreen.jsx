import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Feather from "@react-native-vector-icons/feather";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

import API from "../../services/api";

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function VoiceScreen({ navigation }) {

  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState(null);

  // 🎙 START RECORD
  const startRecording = async () => {
    try {
      const path = "voice_note.mp4";
      const result = await audioRecorderPlayer.startRecorder(path);

      setRecording(true);
      console.log("Recording started:", result);

    } catch (err) {
      console.log("START ERROR:", err);
    }
  };

  // 🛑 STOP RECORD
  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();

      setRecording(false);
      setAudioPath(result);

      console.log("Recording saved:", result);

    } catch (err) {
      console.log("STOP ERROR:", err);
    }
  };

  // ▶ PLAY AUDIO
  const playAudio = async () => {
    if (!audioPath) return;

    try {
      await audioRecorderPlayer.startPlayer(audioPath);
    } catch (err) {
      console.log("PLAY ERROR:", err);
    }
  };

  // 💾 SAVE (API optional)
  const saveVoice = async () => {
    try {
      const payload = {
        title: "Voice Note",
        audioUrl: audioPath,
      };

      // अगर backend है:
      // await API.post("/voice", payload);

      Alert.alert("Saved", "Voice note saved");
      navigation.goBack();

    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>

        <Text style={styles.title}>Voice Note</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* BODY */}
      <View style={styles.center}>

        <TouchableOpacity
          style={[
            styles.micBtn,
            recording && { backgroundColor: "red" },
          ]}
          onPress={recording ? stopRecording : startRecording}
        >
          <Feather name="mic" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.status}>
          {recording ? "Recording..." : "Tap to record"}
        </Text>

        {audioPath && (
          <>
            <TouchableOpacity style={styles.playBtn} onPress={playAudio}>
              <Text style={styles.playText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={saveVoice}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </>
        )}

      </View>

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
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  micBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F35539",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  status: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },

  playBtn: {
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 10,
  },

  playText: {
    color: "#fff",
  },

  saveBtn: {
    padding: 12,
    backgroundColor: "#F35539",
    borderRadius: 8,
  },

  saveText: {
    color: "#fff",
  },
});