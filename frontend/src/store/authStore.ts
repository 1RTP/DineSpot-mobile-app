import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import { useRestaurantStore } from './restaurantStore';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string | null;
}

interface AuthState { 
  user: User | null; 
  token: string | null; 
  isLoading: boolean; 
  isAuthenticated: boolean; 
  login: (email: string, password: string) => Promise<boolean>; 
  register: (fullName: string, email: string, password: string) => Promise<boolean>; 
  logout: () => Promise<void>; 
  updateProfile: (data: { fullName?: string; email?: string }) => Promise<boolean>; 
  updateAvatar: (base64Image: string) => Promise<boolean>; 
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>; 
  loadUser: () => Promise<void>; 
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { user, token } = response.data;
      await storage.setItem('token', token);
      await storage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
      await useRestaurantStore.getState().loadFavorites(token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  register: async (fullName, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, { fullName, email, password });
      const { user, token } = response.data;
      await storage.setItem('token', token);
      await storage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
      await useRestaurantStore.getState().loadFavorites(token);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await storage.removeItem('token');
      await storage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
      useRestaurantStore.setState({ favorites: [] });
    } catch (error) {
      console.error('Logout error:', error);
      set({ user: null, token: null, isAuthenticated: false });
      useRestaurantStore.setState({ favorites: [] });
    }
  },

  loadUser: async () => {
    try {
      const token = await storage.getItem('token');
      const userStr = await storage.getItem('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
        await useRestaurantStore.getState().loadFavorites(token);
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: { fullName?: string; email?: string }) => {
    try {
      const { token } = get();
      const response = await axios.put(
        `${API_URL}/api/auth/profile`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = response.data;
      await storage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  },

  updateAvatar: async (base64Image: string) => {
    try {
      const { token } = get();
      const response = await axios.put(
        `${API_URL}/api/auth/avatar`,
        { avatar: base64Image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = response.data;
      await storage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return true;
    } catch (error) {
      console.error('Update avatar error:', error);
      return false;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const { token } = get();
      await axios.put(
        `${API_URL}/api/auth/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  },

}));