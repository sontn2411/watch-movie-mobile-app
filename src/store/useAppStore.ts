import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

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
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

