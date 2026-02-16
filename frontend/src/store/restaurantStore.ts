import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  image?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  image: string;
  cuisine: string;
  country: string;
  description?: string;
  menu?: MenuItem[];
}

interface Filters {
  cuisine: string;
  ratingMin: number;
  ratingMax: number;
  country: string;
  search: string;
}

interface RestaurantState {
  restaurants: Restaurant[];
  favorites: string[];
  filters: Filters;
  isLoading: boolean;
  fetchRestaurants: () => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
  toggleFavorite: (restaurantId: string, token?: string | null) => Promise<void>;
  loadFavorites: (token?: string | null) => Promise<void>;
  getFilteredRestaurants: () => Restaurant[];
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  favorites: [],
  filters: {
    cuisine: '',
    ratingMin: 0,
    ratingMax: 5,
    country: '',
    search: '',
  },
  isLoading: false,

  fetchRestaurants: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/api/restaurants`);
      set({ restaurants: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch restaurants error:', error);
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters: Partial<Filters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  toggleFavorite: async (restaurantId: string, token?: string | null) => {
    const { favorites } = get();
    const isFavorite = favorites.includes(restaurantId);

    if (token) {
      try {
        if (isFavorite) {
          await axios.delete(`${API_URL}/api/favorites/${restaurantId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ favorites: favorites.filter((id) => id !== restaurantId) });
        } else {
          await axios.post(
            `${API_URL}/api/favorites`,
            { restaurantId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          set({ favorites: [...favorites, restaurantId] });
        }
      } catch (error) {
        console.error('Sync favorites error:', error);
      }
    } else {
      const newFavorites = isFavorite
        ? favorites.filter((id) => id !== restaurantId)
        : [...favorites, restaurantId];
      set({ favorites: newFavorites });
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  },

  loadFavorites: async (token?: string | null) => {
    try {
      if (token) {
        const response = await axios.get(`${API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ favorites: response.data.map((f: any) => f.restaurantId) });
      } else {
        const favoritesStr = await AsyncStorage.getItem('favorites');
        if (favoritesStr) {
          set({ favorites: JSON.parse(favoritesStr) });
        }
      }
    } catch (error) {
      console.error('Load favorites error:', error);
      // Fallback to local storage
      const favoritesStr = await AsyncStorage.getItem('favorites');
      if (favoritesStr) {
        set({ favorites: JSON.parse(favoritesStr) });
      }
    }
  },

  getFilteredRestaurants: () => {
    const { restaurants, filters } = get();
    return restaurants.filter((restaurant) => {
      const matchesCuisine = !filters.cuisine || restaurant.cuisine === filters.cuisine;
      const matchesRating =
        restaurant.rating >= filters.ratingMin && restaurant.rating <= filters.ratingMax;
      const matchesCountry = !filters.country || restaurant.country === filters.country;
      const matchesSearch =
        !filters.search ||
        restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCuisine && matchesRating && matchesCountry && matchesSearch;
    });
  },
}));
