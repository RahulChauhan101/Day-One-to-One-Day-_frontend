import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
baseURL: "http://10.35.58.218:4000/api",

  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Request Interceptor (token auto attach)
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");

      console.log("TOKEN FROM STORAGE:", token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 🔍 DEBUG: check headers
      console.log("HEADERS:", config.headers);

    } catch (error) {
      console.log("TOKEN ERROR:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;