// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import Feather from "@react-native-vector-icons/feather";
// import { Audio } from "expo-av";

// export default function VoiceScreen({ navigation }) {
//   const [recording, setRecording] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioPath, setAudioPath] = useState(null);
//   const [sound, setSound] = useState(null);

//   // 🎙 START RECORD
//   const startRecording = async () => {
//     try {
//       await Audio.requestPermissionsAsync();

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );

//       setRecording(recording);
//       setIsRecording(true);

//     } catch (err) {
//       console.log("START ERROR:", err);
//     }
//   };

//   // 🛑 STOP RECORD
//   const stopRecording = async () => {
//     try {
//       await recording.stopAndUnloadAsync();

//       const uri = recording.getURI();

//       setAudioPath(uri);
//       setRecording(null);
//       setIsRecording(false);

//       console.log("Saved at:", uri);

//     } catch (err) {
//       console.log("STOP ERROR:", err);
//     }
//   };

//   // ▶ PLAY AUDIO
//   const playAudio = async () => {
//     try {
//       const { sound } = await Audio.Sound.createAsync({
//         uri: audioPath,
//       });

//       setSound(sound);
//       await sound.playAsync();

//     } catch (err) {
//       console.log("PLAY ERROR:", err);
//     }
//   };

//   // 💾 SAVE
//   const saveVoice = async () => {
//     try {
//       const payload = {
//         title: "Voice Note",
//         audioUrl: audioPath,
//       };

//       Alert.alert("Saved", "Voice note saved");
//       navigation.goBack();

//     } catch (err) {
//       console.log("SAVE ERROR:", err);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
      
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Feather name="arrow-left" size={22} />
//         </TouchableOpacity>

//         <Text style={styles.title}>Voice Note</Text>

//         <View style={{ width: 22 }} />
//       </View>

//       {/* BODY */}
//       <View style={styles.center}>
//         <TouchableOpacity
//           style={[
//             styles.micBtn,
//             isRecording && { backgroundColor: "red" },
//           ]}
//           onPress={isRecording ? stopRecording : startRecording}
//         >
//           <Feather name="mic" size={28} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.status}>
//           {isRecording ? "Recording..." : "Tap to record"}
//         </Text>

//         {audioPath && (
//           <>
//             <TouchableOpacity style={styles.playBtn} onPress={playAudio}>
//               <Text style={styles.playText}>Play</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.saveBtn} onPress={saveVoice}>
//               <Text style={styles.saveText}>Save</Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF5EC",
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 20,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   micBtn: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#F35539",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },

//   status: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 20,
//   },

//   playBtn: {
//     padding: 12,
//     backgroundColor: "#333",
//     borderRadius: 8,
//     marginBottom: 10,
//   },

//   playText: {
//     color: "#fff",
//   },

//   saveBtn: {
//     padding: 12,
//     backgroundColor: "#F35539",
//     borderRadius: 8,
//   },

//   saveText: {
//     color: "#fff",
//   },
// });


import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

export default function VoiceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text>Voice feature coming soon...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5EC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});