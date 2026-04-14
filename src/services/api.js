import axios from "axios";

const API = axios.create({
  baseURL: "https://creviced-nonmeditative-neymar.ngrok-free.dev/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;