import { createApiClient, StorageInterface, getErrorMessage } from '@bharat-low-oil/api-client';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const storage: StorageInterface = {
  getItem: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  setItem: async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => {
    await SecureStore.deleteItemAsync(key);
  },
};

const apiClient = createApiClient({
  baseURL: API_BASE_URL,
  storage,
  onUnauthorized: () => {
    // TODO: Navigate to login
    // In React Native, we might need to use a navigation ref or event emitter
  },
  getLanguage: async () => {
    return await AsyncStorage.getItem('language') || 'en';
  }
});

export { getErrorMessage };
export default apiClient;

