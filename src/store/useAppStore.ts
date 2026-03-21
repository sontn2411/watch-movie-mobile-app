import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { WatchHistoryItem } from '../types/movies';

const storage = createMMKV();

const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.remove(name);
  },
};

type ThemeMode = 'dark' | 'light' | 'system';
type Language = 'vi' | 'en';

interface User {
  username: string;
  email: string;
}

interface AppState {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Auth
  userToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (token: string | null, refreshToken: string | null, user?: User) => void;
  logout: () => void;
  
  // App State
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;

  // Search
  searchHistory: string[];
  addSearchKeyword: (keyword: string) => void;
  removeSearchHistoryItem: (keyword: string) => void;
  clearSearchHistory: () => void;

  // Watch History
  watchHistory: WatchHistoryItem[];
  addToHistory: (movie: WatchHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Favorites
  favorites: WatchHistoryItem[];
  addFavorite: (movie: WatchHistoryItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      language: 'vi',
      setLanguage: (language) => set({ language }),
      
      userToken: storage.getString('user_token') || null,
      refreshToken: storage.getString('refresh_token') || null,
      user: JSON.parse(storage.getString('user_profile') || 'null'),

      setAuth: (userToken, refreshToken, user) => {
        if (userToken) storage.set('user_token', userToken);
        else storage.remove('user_token');

        if (refreshToken) storage.set('refresh_token', refreshToken);
        else storage.remove('refresh_token');

        if (user) storage.set('user_profile', JSON.stringify(user));
        else storage.remove('user_profile');

        set({ userToken, refreshToken, user: user || get().user });
      },

      logout: () => {
        storage.remove('user_token');
        storage.remove('refresh_token');
        storage.remove('user_profile');
        set({ userToken: null, refreshToken: null, user: null });
      },
      
      hasSeenWelcome: storage.getBoolean('hasSeenWelcome') || false,
      setHasSeenWelcome: (hasSeenWelcome) => {
        storage.set('hasSeenWelcome', hasSeenWelcome);
        set({ hasSeenWelcome });
      },

      searchHistory: JSON.parse(storage.getString('search_history') || '[]'),
      addSearchKeyword: (keyword) => {
        if (!keyword.trim()) return;
        const currentHistory = get().searchHistory;
        const filtered = currentHistory.filter(item => item !== keyword.trim());
        const newHistory = [keyword.trim(), ...filtered].slice(0, 10);
        storage.set('search_history', JSON.stringify(newHistory));
        set({ searchHistory: newHistory });
      },
      removeSearchHistoryItem: (keyword) => {
        const newHistory = get().searchHistory.filter(item => item !== keyword);
        storage.set('search_history', JSON.stringify(newHistory));
        set({ searchHistory: newHistory });
      },
      clearSearchHistory: () => {
        storage.remove('search_history');
        set({ searchHistory: [] });
      },

      watchHistory: JSON.parse(storage.getString('watch_history') || '[]'),
      addToHistory: (movie) => {
        const currentHistory = get().watchHistory;
        const existingIndex = currentHistory.findIndex(item => item._id === movie._id);
        
        let updatedMovie = { ...movie };
        
        // Preserve previous currentTime/duration if the new one doesn't have it (e.g. just opening details)
        // But if we're actually passing a new currentTime (0 or more), we use it.
        if (existingIndex >= 0) {
          const existing = currentHistory[existingIndex];
          if (movie.currentTime === undefined && existing.currentTime !== undefined) {
             updatedMovie.currentTime = existing.currentTime;
             updatedMovie.duration = existing.duration;
          }
        }

        const filtered = currentHistory.filter(item => item._id !== movie._id);
        const newHistory = [updatedMovie, ...filtered].slice(0, 50); // Keep last 50 items
        storage.set('watch_history', JSON.stringify(newHistory));
        set({ watchHistory: newHistory });
      },
      removeFromHistory: (id) => {
        const newHistory = get().watchHistory.filter(item => item._id !== id);
        storage.set('watch_history', JSON.stringify(newHistory));
        set({ watchHistory: newHistory });
      },
      clearHistory: () => {
        storage.remove('watch_history');
        set({ watchHistory: [] });
      },

      favorites: JSON.parse(storage.getString('favorites') || '[]'),
      addFavorite: (movie) => {
        const currentFavorites = get().favorites;
        if (currentFavorites.some(item => item._id === movie._id)) return;
        
        const newFavorites = [movie, ...currentFavorites];
        storage.set('favorites', JSON.stringify(newFavorites));
        set({ favorites: newFavorites });
      },
      removeFavorite: (id) => {
        const newFavorites = get().favorites.filter(item => item._id !== id);
        storage.set('favorites', JSON.stringify(newFavorites));
        set({ favorites: newFavorites });
      },
      isFavorite: (id) => {
        return get().favorites.some(item => item._id === id);
      },
      clearFavorites: () => {
        storage.remove('favorites');
        set({ favorites: [] });
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

