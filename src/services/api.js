import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
baseURL: "http://10.34.67.218:4000/api/",
// baseURL: "http://192.168.137.1:4000/api",

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

// ✅ RESPONSE INTERCEPTOR (👉 YAHAN ADD KARNA HAI)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("FULL ERROR:", err);
    console.log("ERROR DATA:", err.response?.data);
    console.log("ERROR MESSAGE:", err.message);
    console.log("BASE URL:", API.defaults.baseURL);
    return Promise.reject(err);
  }
);

export default API;