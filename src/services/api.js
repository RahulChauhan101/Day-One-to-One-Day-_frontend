import axios from "axios";
import { Platform } from "react-native";

// 👉 Auto detect (Android emulator vs real device)
const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:4000/api" // emulator
    : "http://192.168.29.120:4000/api"; // real device (iOS / fallback)

// 👉 Optional: manual override (agar real Android device use kar rahe ho)
const REAL_DEVICE_URL = "http://192.168.1.5:4000/api";

const API = axios.create({
  baseURL: __DEV__ ? REAL_DEVICE_URL : BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;