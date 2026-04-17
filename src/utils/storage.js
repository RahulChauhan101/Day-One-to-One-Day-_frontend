import AsyncStorage from "@react-native-async-storage/async-storage";

export const setToken = async (token) => {
  await AsyncStorage.setItem("token", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
  
};

export const setUser = async (user) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return JSON.parse(user);
};

export const logout = async () => {
  await AsyncStorage.clear();
};